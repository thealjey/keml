from argparse import ArgumentParser
from base64 import urlsafe_b64decode, urlsafe_b64encode
from datetime import datetime, timedelta, timezone
from email import message_from_bytes
from enum import Enum
from hashlib import sha256
from hmac import new
from html.parser import HTMLParser
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from inspect import stack
from json import dumps, loads
from markdown import markdown
from math import ceil
from os import urandom
from os.path import basename, dirname, getmtime, join, realpath
from re import MULTILINE, split, sub
from sys import exit
from threading import Lock, Thread
from time import sleep, time
from traceback import format_exc
from typing import Any, Callable, Iterable, Literal, TypeVar
from unicodedata import normalize
from urllib.parse import parse_qs, urlencode, urlparse, quote
from webbrowser import open as open_browser
from xml.dom.minidom import Node


class Encode(Enum):
    STR = 1
    URL = 2


T = TypeVar("T")


def get_one(dictionary: dict[str, list[T]], key: str):
    value = dictionary.get(key)
    return value[0] if value and len(value) else None


def resolve_filename() -> str:
    return next(x for x in stack() if x.filename != __file__).filename


def asdict(value: Any) -> dict[str, Any]:
    try:
        return dict((x, getattr(value, x)) for x in dir(value))
    except:
        print(format_exc())
        return {}


def split_commas(value: str | None) -> list[str]:
    return (
        [x for x in set(split(r"\s*,\s*", value)) if len(x)]
        if value and len(value)
        else []
    )


def parse_segments(template: str) -> list[tuple[bool, str]]:
    braces = 0
    results: list[tuple[bool, str]] = []
    for char in template:
        inside = bool(braces)
        if char == "{":
            braces += 1
            if not inside:
                continue
        if char == "}":
            if braces:
                braces -= 1
            if inside and not braces:
                continue
        inside = bool(braces)
        if len(results) and results[-1][0] == inside:
            results[-1] = (inside, results[-1][1] + char)
        else:
            results.append((inside, char))
    return results


def eval_segments(
    segments: list[tuple[bool, str]], **kwargs: Any
) -> list[str | Any]:
    results: list[str | Any] = []
    for inside, value in segments:
        if inside:
            try:
                value = eval(value, kwargs)
            except Exception as e:
                print(value, " -> ", e)
                value = None
        results.append(value)
    return results


def match_segments(
    template: str, string: str, segments: list[tuple[bool, str]]
) -> dict[str, str] | None:
    result: dict[str, str] = {}
    offset = 0
    limits: list[tuple[str, int, int | None]] = []
    for inside, value in segments:
        if inside:
            limits.append((value.strip(), offset, None))
        else:
            i = string.find(value, offset)
            if i == -1:
                return
            offset = i + len(value)
            if len(limits):
                name, start, _ = limits[-1]
                limits[-1] = (name, start, i)
    if not len(limits):
        return result if template == string else None
    _, start, _ = limits[0]
    if start != 0:
        _, value = segments[0]
        if value != string[0:start]:
            return
    _, _, end = limits[-1]
    if end is not None:
        _, value = segments[-1]
        if value != string[end:]:
            return
    for name, start, end in limits:
        result[name] = string[start:end]
    return result


def make_str(value: Any | None, encode: Encode = Encode.STR) -> str:
    if value is None:
        return ""
    result = str(value)
    if encode == Encode.URL:
        result = quote(result)
    return result


def join_segments(
    values: list[str | Any], encode: Encode = Encode.STR
) -> Any | str | None:
    count = len(values)
    return (
        values[0]
        if count == 1
        else "".join(make_str(x, encode) for x in values) if count else None
    )


def fstr(value: str, **kwargs: Any) -> Any | str | None:
    return join_segments(eval_segments(parse_segments(value), **kwargs))


def join_query(**kwargs: Any) -> str:
    query = urlencode(kwargs).strip()
    return f"?{query}" if len(query) else ""


def extract_names(segments: list[tuple[bool, str]]) -> list[str]:
    return [value.strip() for inside, value in segments if inside]


def split_known(
    names: list[str], **kwargs: Any
) -> tuple[dict[str, Any], dict[str, Any]]:
    extra = kwargs.copy()
    known: dict[str, Any] = {}
    for name in names:
        value = extra.pop(name, None)
        if value is not None:
            known[name] = value
    return known, extra


def generate_url(
    segments: list[tuple[bool, str]], names: list[str], **kwargs: Any
) -> str:
    ctx, query = split_known(names, **kwargs)
    return make_str(
        join_segments(eval_segments(segments, **ctx), Encode.URL)
    ) + join_query(**query)


gravatar_segments = parse_segments("https://www.gravatar.com/avatar/{hash}")
gravatar_names = extract_names(gravatar_segments)


def generate_gravatar_url(email: str, size: int = 100) -> str:
    return generate_url(
        gravatar_segments,
        gravatar_names,
        hash=sha256(email.strip().lower().encode()).hexdigest(),
        s=size,
    )


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    value = urandom(16) if salt is None else bytes.fromhex(salt)
    return value.hex(), sha256(password.encode() + value).hexdigest()


def btoa(value: str | dict[str, Any] | bytes) -> str:
    sb = dumps(value) if isinstance(value, dict) else value
    return urlsafe_b64encode(
        sb.encode() if isinstance(sb, str) else sb
    ).decode()


def generate_signature(secret: str, start: str) -> str:
    return btoa(new(secret.encode(), start.encode(), sha256).digest())


def generate_token(secret: str, user_id: int) -> str:
    start = f"{btoa({"typ": "JWT", "alg": "HS256"})}.{
        btoa({"user_id": user_id})}"
    return f"{start}.{generate_signature(secret, start)}"


def verify_token(secret: str, token: str) -> bool:
    try:
        header, payload, signature = token.split(".")
        return signature == generate_signature(secret, f"{header}.{payload}")
    except:
        return False


def generate_slug(value: str) -> str:
    return sub(
        r"[^a-z0-9]+",
        "-",
        normalize("NFKD", value).encode("ascii", "ignore").decode().lower(),
    ).strip("-")


def strip_path(path: str):
    stripped = path.rstrip("/")
    return stripped if len(stripped) else "/"


class Server(ThreadingHTTPServer):

    def start(self, fn: Callable[[], Any] | None = None):
        parser = ArgumentParser()
        parser.add_argument("-o", action="store_true")
        should_open_browser: bool = parser.parse_args().o

        url = f"http://{self.server_address[0]}:{self.server_address[1]}"
        print(f"Server running at {url}")
        if should_open_browser:
            open_browser(url)
        try:
            self.serve_forever()
        except KeyboardInterrupt:
            if fn:
                fn()
            exit(0)


self_closing = [
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "include",
]


class SimpleNode:

    def __init__(
        self,
        nodeType: Literal[1, 3, 8, 9],
        *,
        tagName: str = "",
        nodeValue: str = "",
    ):
        self.tagName = tagName.lower()
        self.nodeType = nodeType
        self.nodeValue = nodeValue
        self.parentNode: SimpleNode | None = None
        self.firstChild: SimpleNode | None = None
        self.lastChild: SimpleNode | None = None
        self.previousSibling: SimpleNode | None = None
        self.nextSibling: SimpleNode | None = None
        self.attrs: dict[str, str | None] = {}
        self.childNodes: list[SimpleNode] = []

    def setAttribute(self, name: str, value: str | None):
        self.attrs[name] = value

    def getAttribute(self, name: str) -> str | None:
        return self.attrs.get(name)

    def appendChild(self, node: "SimpleNode"):
        node.parentNode = self
        if self.lastChild:
            node.previousSibling = self.lastChild
            self.lastChild.nextSibling = node
        self.childNodes.append(node)
        self.lastChild = node
        self.firstChild = self.childNodes[0]

    def print(self, *, docType: bool = False, pretty: bool = False) -> str:
        if self.nodeType == Node.TEXT_NODE:
            text = (
                self.nodeValue
                if self.parentNode
                and self.parentNode.tagName in ["textarea", "pre"]
                else sub(r"\s+", " ", self.nodeValue, flags=MULTILINE)
            )
            if not self.previousSibling:
                text = text.lstrip()
            if not self.nextSibling:
                text = text.rstrip()
            if text.isspace():
                return ""
            if pretty:
                return text
            escape_map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            }
            return "".join(escape_map.get(ch, ch) for ch in text)
        if self.nodeType == Node.COMMENT_NODE:
            return f"<!-- {self.nodeValue.strip()} -->" if pretty else ""
        depth = 0
        cur = self
        lines: list[str] = []
        while cur.parentNode and cur.parentNode.nodeType != Node.DOCUMENT_NODE:
            depth += 1
            cur = cur.parentNode
        if docType and self.tagName == "html":
            lines.append("<!DOCTYPE html>")
        if self.parentNode:
            sorted_attrs = dict(sorted(self.attrs.items()))
            attrs: list[str] = []
            for name, value in sorted_attrs.items():
                value = value.strip() if value else None
                if value:
                    if (
                        name
                        in [
                            "class",
                            "error",
                            "result",
                            "x-class",
                            "x-error",
                            "x-result",
                        ]
                        or name.startswith("on:")
                        or name.startswith("if:")
                        or name.startswith("x-on:")
                        or name.startswith("x-if:")
                    ):
                        new_token = True
                        tokens: list[str] = []
                        for inside, content in parse_segments(value):
                            if not inside:
                                new_token = content[-1].isspace()
                                chunks = content.split()
                                if len(chunks):
                                    first, *other = chunks
                                    if not len(tokens) or content[0].isspace():
                                        tokens.append(first)
                                    else:
                                        tokens[-1] += first
                                    tokens += other
                            elif new_token:
                                tokens.append("{" + content + "}")
                            else:
                                tokens[-1] += "{" + content + "}"
                        tokens.sort()
                        value = " ".join(tokens)
                    attrs.append(f'{name}="{value}"')
                else:
                    attrs.append(name)
            line = (
                f"<{self.tagName}{" " if len(attrs) else ""}{" ".join(attrs)}>"
            )
            if pretty and len(line) + depth * 2 > 80:
                lines.append(f"<{self.tagName}")
                for attr in attrs:
                    lines.append("  " + attr)
                lines.append(">")
            else:
                lines.append(line)
        if self.tagName not in self_closing:
            children: list[str] = []
            count = 0
            is_text = False
            for node in self.childNodes:
                child = node.print(docType=docType, pretty=pretty)
                if child.strip():
                    count += 1
                    is_text = node.nodeType == Node.TEXT_NODE
                    children.append(child)
            wrapped = False
            if count == 1 and is_text:
                prev = lines.pop()
                line = f"{prev}{children[0]}"
                if (
                    pretty
                    and len(line) + depth * 2 + len(self.tagName) + 3 > 80
                ):
                    wrapped = True
                    lines.append(prev)
                    lines.append("  " + children[0].lstrip())
                else:
                    lines.append(line)
            else:
                lines += [
                    (
                        f"  {child.lstrip()}"
                        if pretty and self.parentNode
                        else child
                    )
                    for child in children
                ]
            if self.parentNode:
                lines.append(
                    f"{lines.pop() if not wrapped and (not count or count == 1 and is_text) else ""}</{self.tagName}>"
                )
        return ("\n" + ("  " * depth) if pretty else "").join(lines)


class Parser(HTMLParser):

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.document = SimpleNode(Node.DOCUMENT_NODE)
        self.current = self.document

    def parse(self, data: str):
        self.feed(data)
        return self.document

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]):
        if self.current:
            element = SimpleNode(Node.ELEMENT_NODE, tagName=tag)
            for attr, value in attrs:
                element.setAttribute(attr, value)
            self.current.appendChild(element)
            if tag not in self_closing:
                self.current = element

    def handle_endtag(self, tag: str):
        if self.current and tag not in self_closing:
            self.current = self.current.parentNode

    def handle_data(self, data: str):
        if self.current:
            last = self.current.lastChild
            if last and last.nodeType == Node.TEXT_NODE:
                last.nodeValue += data
            else:
                self.current.appendChild(
                    SimpleNode(Node.TEXT_NODE, nodeValue=data)
                )

    def handle_entityref(self, name: str):
        self.handle_data(f"&{name};")

    def handle_charref(self, name: str):
        self.handle_data(f"&#{name};")

    def handle_comment(self, data: str):
        if self.current:
            self.current.appendChild(
                SimpleNode(Node.COMMENT_NODE, nodeValue=data)
            )


def tree(path: str, left: SimpleNode, right: SimpleNode, **kwargs: Any):
    for node in right.childNodes:
        if node.nodeType == Node.ELEMENT_NODE:
            if node.tagName == "yes":
                value = node.getAttribute("condition")
                if value:
                    value = fstr(value, **kwargs)
                    if isinstance(value, str):
                        value = kwargs.get(value)
                if value:
                    tree(path, left, node, **kwargs)
            elif node.tagName == "no":
                value = node.getAttribute("condition")
                if value:
                    value = fstr(value, **kwargs)
                    if isinstance(value, str):
                        value = kwargs.get(value)
                if not value:
                    tree(path, left, node, **kwargs)
            elif node.tagName == "for":
                value = node.getAttribute("collection")
                if value:
                    value = fstr(value, **kwargs)
                    if isinstance(value, str):
                        value = kwargs.get(value)
                if isinstance(value, (list, set)):
                    lst: Iterable[Any] = value  # type: ignore
                    for index, item in enumerate(lst):  # type: ignore
                        tree(
                            path,
                            left,
                            node,
                            **{
                                **kwargs,
                                **asdict(item),
                                "i": index,
                                "item": item,
                                "items": value,
                            },
                        )
            elif node.tagName == "include":
                value = node.getAttribute("tpl")
                if value:
                    value = fstr(value, **kwargs)
                if isinstance(value, str):
                    real, xml = parse_html(path, value)
                    ctx: dict[str, Any] = {}
                    for attr, value in node.attrs.items():
                        if attr == "tpl":
                            continue
                        if value:
                            value = fstr(value, **kwargs)
                        ctx[attr] = value
                    tree(real, left, xml, **{**kwargs, **ctx})
            else:
                element = SimpleNode(Node.ELEMENT_NODE, tagName=node.tagName)
                for attr, value in node.attrs.items():
                    if value:
                        value = fstr(value, **kwargs)
                        if isinstance(value, str) or value:
                            element.setAttribute(
                                attr,
                                None if isinstance(value, bool) else str(value),
                            )
                    else:
                        element.setAttribute(attr, value)
                tree(path, element, node, **kwargs)
                left.appendChild(element)
        elif node.nodeType == Node.TEXT_NODE:
            value = make_str(fstr(node.nodeValue, **kwargs))
            if len(value):
                last = left.lastChild
                if last and last.nodeType == Node.TEXT_NODE:
                    last.nodeValue += value
                else:
                    left.appendChild(
                        SimpleNode(Node.TEXT_NODE, nodeValue=value)
                    )


docs: dict[str, tuple[int, SimpleNode]] = {}


def parse_html(path: str, name: str) -> tuple[str, SimpleNode]:
    real = realpath(join(dirname(path), name + ".html"))
    with open(real) as f:
        time = int(getmtime(f.fileno()))
        if real not in docs or docs[real][0] != time:
            docs[real] = (time, Parser().parse(f.read().strip()))
    return real, docs[real][1]


increment = 0
clients: dict[str, list[BaseHandler]] = {}
clients_lock = Lock()


class BaseHandler(BaseHTTPRequestHandler):

    SECRET = ""

    DATETIME_FORMAT = "%c"

    ROUTES: list[tuple[str, str]] = []

    def log_message(self, format: str, *args: Any):
        super().log_message(f"{format} {" -> ".join(self.method_msg)}", *args)

    def parse_request(self) -> bool:
        parent = super().parse_request()
        parsed = urlparse(self.path)
        self.parsed_path = strip_path(parsed.path)
        self.base_name = basename(self.parsed_path)
        self.parsed_query = parse_qs(parsed.query)
        self.is_xhr = self.headers.get("X-Requested-With") == "XMLHttpRequest"
        self.response_headers: list[tuple[str, str]] = []
        self.status_sent = False
        self.parsed_cookies = SimpleCookie(self.headers.get("Cookie"))
        self.user = None
        self.active_route = None
        self.method_msg: list[str] = []
        token = self.parsed_cookies.get("jwt")
        if token:
            try:
                self.set_user(
                    loads(
                        urlsafe_b64decode(
                            token.value.split(".")[1] + "=="
                        ).decode()
                    ).get("user_id")
                )
            except:
                print(format_exc())
        self.response_headers.append(
            (
                "Content-Type",
                (
                    "text/javascript"
                    if self.parsed_path.endswith(".js")
                    else (
                        "text/css"
                        if self.parsed_path.endswith(".css")
                        else (
                            "image/x-icon"
                            if self.parsed_path.endswith(".ico")
                            else (
                                "text/event-stream"
                                if self.parsed_path.endswith(".sse")
                                else "text/html"
                            )
                        )
                    )
                ),
            )
        )
        if self.parsed_path.endswith(".sse"):
            self.response_headers.append(("Cache-Control", "no-cache"))
            self.response_headers.append(("Connection", "keep-alive"))
        return parent

    def set_user(self, user_id: int):
        self.user = None

    def handle_sse(self):
        with clients_lock:
            clients.setdefault(self.parsed_path, []).append(self)
        try:
            self.wfile.write(b": connected\n\n")
            self.wfile.flush()
            while True:
                self.wfile.write(b": ping\n\n")
                self.wfile.flush()
                sleep(15)
        except (BrokenPipeError, ConnectionResetError, OSError) as e:
            if e.winerror != 10038:
                print("Unexpected SSE error:", format_exc())
        except Exception:
            print("Unexpected SSE error:", format_exc())
        finally:
            with clients_lock:
                if self in clients.setdefault(self.parsed_path, []):
                    clients[self.parsed_path].remove(self)

    def send_status(self, status: int = 200):
        self.send_response(status)
        for name, value in self.response_headers:
            self.send_header(name, value)
        self.end_headers()
        self.status_sent = True

    def send_bytes(self, data: bytes, status: int = 200):
        self.send_status(status)
        self.wfile.write(data)

    def send_sse_string(self, path: str, event: str, data: str | None):
        with clients_lock:
            for client in clients.setdefault(path, [])[:]:
                try:
                    client.wfile.write(f"event: {event}\n".encode())
                    client.wfile.write(f"data: {data}\n\n".encode())
                    client.wfile.flush()
                except Exception:
                    clients[path].remove(client)

    def send_string(self, data: str, status: int = 200):
        self.send_bytes(data.encode(), status)

    def send_strings(self, data: list[str], status: int = 200):
        self.send_status(status)
        for msg in data:
            self.wfile.write(msg.encode())

    def send_tpl(self, name: str, status: int = 200, **kwargs: Any):
        self.send_string(self.tpl(name, **kwargs), status)

    def send_sse_tpl(self, path: str, event: str, name: str, **kwargs: Any):
        self.send_sse_string(path, event, self.tpl(name, **kwargs))

    def send_file(self, name: str):
        real = realpath(join(dirname(resolve_filename()), name))
        with open(real, "rb") as f:
            self.send_bytes(f.read())

    def single_parsed_data(self, name: str):
        return get_one(self.parsed_data, name)

    def single_parsed_query(self, name: str):
        return get_one(self.parsed_query, name)

    def execute_method(self, verb: str, name: str, status: int = 200) -> bool:
        suffixes: list[str] = []
        if self.is_xhr:
            if self.user:
                suffixes.append("_xhr_auth")
                suffixes.append("_auth_xhr")
            suffixes.append("_xhr")
        elif self.user:
            suffixes.append("_auth")
        suffixes.append("")
        for suffix in suffixes:
            method = f"{verb}_{name}{suffix}"
            attr = getattr(self, method, None)
            if attr:
                self.method_msg.append(method)
                attr()
                if not self.status_sent:
                    self.send_status(status)
                if self.parsed_path.endswith(".sse"):
                    Thread(target=self.handle_sse, daemon=True).start()
                return True
            self.method_msg.append(f"{method}(missing)")
        return False

    def match_path(self, verb: str):
        for name, value in self.ROUTES:
            value = strip_path(value)
            segments = parse_segments(value)
            matches = match_segments(value, self.parsed_path, segments)
            if matches is not None:
                self.parsed_params = matches
                self.active_route = name
                if self.execute_method(verb, name):
                    return
                break
        self.execute_method(verb, "404", 404)
        if not self.status_sent:
            self.send_status(404)

    def url(self, route: str, **kwargs: Any) -> str:
        for name, value in self.ROUTES:
            if route == name:
                segments = parse_segments(value)
                return generate_url(segments, extract_names(segments), **kwargs)
        return ""

    def ftime(self, time: int, format: str | None = None):
        offset = self.parsed_cookies.get("tzo")
        return (
            datetime.fromtimestamp(time)
            .astimezone(
                timezone(
                    timedelta(minutes=int(offset.value) * -1 if offset else 0)
                )
            )
            .strftime(format if format else self.DATETIME_FORMAT)
        )

    def ctx_increment(self, inc: int = 0):
        global increment
        increment += inc
        return increment

    def tpl(self, name: str, **kwargs: Any) -> str:
        doc = SimpleNode(Node.DOCUMENT_NODE)
        real, xml = parse_html(resolve_filename(), name)
        tree(
            real,
            doc,
            xml,
            **{
                "ceil": ceil,
                "markdown": markdown,
                "url": self.url,
                "ftime": self.ftime,
                "time": lambda: int(time()),
                "user": self.user,
                "active_route": self.active_route,
                **dict(
                    (x[4:], getattr(self, x))
                    for x in dir(self)
                    if x.startswith("ctx_")
                ),
                **kwargs,
            },
        )
        return doc.print(docType=True)

    def parse_multipart(self, content_type: str):
        clh = self.headers.get("Content-Length")
        if not clh:
            return
        content_length = int(clh)
        data = self.rfile.read(content_length)
        msg = message_from_bytes(
            b"Content-Type: " + content_type.encode() + b"\n" + data
        )
        for part in msg.walk():
            name = part.get_param("name", header="Content-Disposition")
            if isinstance(name, str):
                value = part.get_payload(decode=True)
                if isinstance(value, bytes):
                    value = value.decode(errors="ignore")
                    if name in self.parsed_data:
                        self.parsed_data[name].append(value)
                    else:
                        self.parsed_data[name] = [value]
                else:
                    print("Unsupported payload: ", value)

    def sign_in(self, user_id: int):
        self.response_headers.append(
            (
                "Set-Cookie",
                f"jwt={generate_token(self.SECRET, user_id)};HttpOnly;Path=/;SameSite=lax",
            )
        )

    def sign_out(self):
        self.response_headers.append(
            ("Set-Cookie", "jwt=;HttpOnly;Path=/;SameSite=lax;Max-Age=0")
        )

    def do_GET(self):
        self.match_path("get")

    def do_POST(self):
        self.parsed_data: dict[str, list[str]] = {}
        content_type = self.headers.get("Content-Type")
        if content_type and content_type.startswith("multipart/form-data"):
            self.parse_multipart(content_type)
        self.match_path("post")

    def do_PUT(self):
        self.match_path("put")

    def do_DELETE(self):
        self.match_path("delete")
