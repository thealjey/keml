from ..common import BaseHandler, Server
from random import randint, choice
from time import sleep
from threading import Thread

greetings = [
    "Hello!",
    "Hi there!",
    "Greetings!",
    "Good day!",
    "Salutations!",
    "Hey hey!",
    "Ahoy!",
    "Howdy!",
    "Yo!",
    "Hiya!",
    "What's up?",
    "Bonjour! 🌟",
    "Hola!",
    "Heyo!",
    "Salve!",
    "G’day mate!",
    "Ahoy-hoy!",
    "Top of the morning!",
    "Howdy-doody!",
    "Peekaboo!",
    "Sup, dude?",
    "Wazzup?",
    "Hola amigo!",
    "Ciao!",
    "Aloha!",
    "Konnichiwa!",
    "Yo ho ho!",
    "Greetings, earthling!",
    "Ello gov'nor!",
    "Howdy partner!",
    "Shalom!",
    "Namaste 🙏",
    "Hey there, sunshine!",
    "Yo yo yo!",
    "Bonjourno!",
    "Salutations and felicitations!",
    "Ahoy matey!",
    "Hail, friend!",
    "Well met!",
    "Good morrow!",
    "Hey, hey, hey!",
    "What's cracking?",
    "Hi-de-ho!",
    "Yo buddy!",
    "Hey, stranger!",
    "Good tidings!",
    "Hi-diddly-ho neighborino!",
    "Greetings and salutations!",
    "Hey there, pal!",
    "Yo, homie!",
    "Wotcha!",
    "How goes it?",
    "Heyo, hero!",
    "Sup, champ?",
    "Hola, compadre!",
]


class Handler(BaseHandler):

    ROUTES = [
        ("js", "/keml.js"),
        ("css", "/style.css"),
        ("home", "/"),
        ("sse", "/events.sse"),
        ("echo", "/echo"),
    ]

    def get_js(self):
        self.send_file(f"../../{self.base_name}")

    def get_css(self):
        self.send_file(self.base_name)

    def get_home(self):
        self.send_tpl("index")

    def get_sse(self):
        """SSE endpoint (handled by .sse route)"""
        Thread(target=self.send_random_hello, daemon=True).start()

    def send_random_hello(self):
        while True:
            sleep(randint(10, 30))
            self.send_sse_tpl(
                self.url("sse"),
                "echo",
                "message",
                text=choice(greetings),
                source="server",
            )

    def post_echo(self):
        self.send_sse_tpl(
            self.url("sse"),
            "echo",
            "message",
            text=self.single_parsed_data("message"),
            source="user",
        )


Server(("127.0.0.1", 8080), Handler).start()
