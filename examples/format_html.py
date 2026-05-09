from argparse import ArgumentParser
from re import DOTALL, IGNORECASE, Match, sub
from sys import stdin
from .common import Parser

parser = ArgumentParser()
parser.add_argument(
    "-l",
    choices=["html", "md"],
    default="html",
    help="Output format (default: html)",
)
parser.add_argument("-f", required=True, help="The file path.")
args = parser.parse_args()


def format_html(html: str):
    return Parser().parse(html).print(pretty=True)


def repl(match: Match[str]) -> str:
    return f"```html\n{format_html(match.group(1))}\n```"


content = stdin.read()

if "docs" in args.f:
    print(content)
else:
    print(
        sub(
            r"```html\s*\n(.*?)\n```",
            repl,
            content.strip(),
            flags=DOTALL | IGNORECASE,
        )
        if args.l == "md"
        else format_html(content.strip())
    )
