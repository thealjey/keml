#!/usr/bin/env python

from http.server import BaseHTTPRequestHandler, HTTPServer
from os.path import dirname, join
from urllib.parse import urlparse, parse_qs

hostName = "0.0.0.0"
serverPort = 8080

dir = dirname(__file__)

todos = []


def toBytes(value):
  return bytes(value, "utf-8")


def getEditor(id, title):
  with open(join(dir, "editor.html"), "r") as f:
    return f.read().format(id=id, title=title)


def getItem():
  with open(join(dir, "item.html"), "r") as f:
    return f.read()


def getInput(action, route, autofocus):
  with open(join(dir, "input.html"), "r") as f:
    return f.read().format(action=action, route=route, autofocus=autofocus)


def getContent(value):
  if len(todos) < 1:
    return ""
  activeTodos = [x for x in todos if x[2] == False]
  completedTodos = [x for x in todos if x[2] == True]
  activeCount = len(activeTodos)
  completedCount = len(completedTodos)
  allCount = len(todos)
  item = getItem()
  all = ""
  active = ""
  completed = ""
  if value == "active":
    visibleTodos = activeTodos
    visibleCount = activeCount
    active = "selected"
  elif value == "completed":
    visibleTodos = completedTodos
    visibleCount = completedCount
    completed = "selected"
  else:
    visibleTodos = todos
    visibleCount = allCount
    all = "selected"
  with open(join(dir, "content.html"), "r") as f:
    return f.read().format(
        visibleTodos="".join([item.format(
            id=todo[0],
            title=todo[1],
            checked="checked" if todo[2] else "",
            completed="completed" if todo[2] else "",
            editing="",
            editor="",
            action="startEdit",
            route="edit"
        ) for todo in visibleTodos]),
        all=all,
        active=active,
        completed=completed,
        activeCount=activeCount,
        checked="" if completedCount < allCount else "checked",
        hidden="" if visibleCount > 0 else "visually-hidden",
        items="item" if activeCount == 1 else "items"
    )


def getIndex(value):
  with open(join(dir, "index.html"), "r") as f:
    return toBytes(f.read().format(
        input=getInput("startEdit", "input-edit", "autofocus"),
        content=getContent(value)
    ))


def getJS(path):
  with open(join(dir, "..", "..", path[1:]), "rb") as f:
    return f.read()


def getCSS(path):
  with open(join(dir, path[1:]), "rb") as f:
    return f.read()


def getEdit(path):
  parsed = urlparse(path)
  id = int(parsed.path[6:])
  todo = next(x for x in todos if x[0] == id)
  title = todo[1]
  return toBytes(getItem().format(
      id=id,
      title=title,
      checked="checked" if todo[2] else "",
      completed="completed" if todo[2] else "",
      editing="editing",
      editor=getEditor(id, title),
      action="endEdit",
      route="todo"
  ))


def getTodo(path):
  parsed = urlparse(path)
  id = int(parsed.path[6:])
  todo = next(x for x in todos if x[0] == id)
  title = todo[1]
  return toBytes(getItem().format(
      id=id,
      title=title,
      checked="checked" if todo[2] else "",
      completed="completed" if todo[2] else "",
      editing="",
      editor="",
      action="startEdit",
      route="edit"
  ))


class TodoServer(BaseHTTPRequestHandler):
  def do_GET(self):
    path = self.path
    wfile = self.wfile
    self.send_response(200)
    if path.endswith(".js"):
      self.send_header("Content-type", "text/javascript")
      self.end_headers()
      wfile.write(getJS(path))
    elif path.endswith(".css"):
      self.send_header("Content-type", "text/css")
      self.end_headers()
      wfile.write(getCSS(path))
    else:
      self.send_header("Content-type", "text/html")
      self.end_headers()
      if path.startswith("/completed/content"):
        wfile.write(toBytes(getContent("completed")))
      elif path.startswith("/active/content"):
        wfile.write(toBytes(getContent("active")))
      elif path.startswith("/input-edit"):
        wfile.write(toBytes(getInput("endEdit", "input", "")))
      elif path.startswith("/completed"):
        wfile.write(getIndex("completed"))
      elif path.startswith("/content"):
        wfile.write(toBytes(getContent("all")))
      elif path.startswith("/active"):
        wfile.write(getIndex("active"))
      elif path.startswith("/input"):
        wfile.write(toBytes(getInput("startEdit", "input-edit", "autofocus")))
      elif path.startswith("/edit"):
        wfile.write(getEdit(path))
      elif path.startswith("/todo"):
        wfile.write(getTodo(path))
      elif path.startswith("/"):
        wfile.write(getIndex("all"))

  def do_POST(self):
    path = self.path
    wfile = self.wfile
    rfile = self.rfile
    headers = self.headers
    self.send_response(200)
    self.send_header("Content-type", "text/html")
    self.end_headers()
    title = rfile.read(int(headers.get(
        "content-length"))).decode().splitlines()[3]
    if path.startswith("/create"):
      id = todos[-1][0] + 1 if len(todos) > 0 else 0
      todos.append([id, title, False])
      wfile.write(toBytes(getItem().format(
          id=id,
          title=title,
          checked="",
          completed="",
          editing="",
          editor="",
          action="startEdit",
          route="edit"
      )))
    elif path.startswith("/rename"):
      parsed = urlparse(path)
      id = int(parsed.path[8:])
      todo = next(x for x in todos if x[0] == id)
      todo[1] = title
      wfile.write(toBytes(title))

  def do_PUT(self):
    global todos
    path = self.path
    self.send_response(200)
    self.send_header("Content-type", "text/html")
    self.end_headers()
    if path.startswith("/toggle-completed"):
      parsed = urlparse(path)
      id = int(parsed.path[18:])
      completed = "completed" in parse_qs(parsed.query)
      todo = next(x for x in todos if x[0] == id)
      todo[2] = completed
    elif path.startswith("/toggle-all"):
      parsed = urlparse(path)
      completed = "completed" in parse_qs(parsed.query)
      todos = [[x[0], x[1], completed] for x in todos]

  def do_DELETE(self):
    global todos
    path = self.path
    self.send_response(200)
    self.send_header("Content-type", "text/html")
    self.end_headers()
    if path.startswith("/remove-completed"):
      todos = [x for x in todos if x[2] == False]
    elif path.startswith("/remove"):
      parsed = urlparse(path)
      id = int(parsed.path[8:])
      todos = [x for x in todos if x[0] != id]


if __name__ == "__main__":
  webServer = HTTPServer((hostName, serverPort), TodoServer)
  print("Server started http://%s:%s" % (hostName, serverPort))
  try:
    webServer.serve_forever()
  except KeyboardInterrupt:
    pass
  webServer.server_close()
  print("Server stopped.")
