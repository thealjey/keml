from ..common import BaseHandler, Server, asdict


class Todo:

  def __init__(self, title: str):
    self.id = id(self)
    self.title = title
    self.completed = False


todos: list[Todo] = []


class Handler(BaseHandler):

  ROUTES = [
      ("js", "/keml.js"),
      ("home", "/"),
      ("active", "/active"),
      ("completed", "/completed"),
      ("todo", "/{id}"),
  ]

  @property
  def ctx_todos(self):
    return todos

  @property
  def ctx_activeTodos(self):
    return [x for x in todos if x.completed == False]

  @property
  def ctx_completedTodos(self):
    return [x for x in todos if x.completed == True]

  def find_todo(self):
    if id := self.parsed_params.get("id"):
      return next((x for x in todos if x.id == int(id)), None)

  def get_js(self):
    self.send_file(f"../../{self.base_name}")

  def get_home(self):
    self.send_tpl("index")

  def get_home_xhr(self):
    self.send_tpl("content")

  def get_active(self):
    self.get_home()

  def get_active_xhr(self):
    self.get_home_xhr()

  def get_completed(self):
    self.get_home()

  def get_completed_xhr(self):
    self.get_home_xhr()

  def get_todo(self):
    todo = self.find_todo()
    action = self.single_parsed_query("action")
    if todo and action:
      self.send_tpl("item", action=action, **asdict(todo))

  def post_home(self):
    if title := self.single_parsed_data("todo"):
      todos.append(Todo(title))

  def post_todo(self):
    todo = self.find_todo()
    title = self.single_parsed_data("todo")
    if todo and title:
      todo.title = title
      self.send_string(title)

  def put_home(self):
    completed = self.single_parsed_query("completed") == "on"
    for todo in todos:
      todo.completed = completed

  def put_todo(self):
    completed = self.single_parsed_query("completed") == "on"
    if todo := self.find_todo():
      todo.completed = completed

  def delete_home(self):
    global todos
    todos = self.ctx_activeTodos

  def delete_todo(self):
    global todos
    if id := self.parsed_params.get("id"):
      todos = [x for x in todos if x.id != int(id)]


Server(("127.0.0.1", 8080), Handler).start()
