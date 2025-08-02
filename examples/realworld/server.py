from ..common import (
    BaseHandler,
    Server,
    asdict,
    generate_gravatar_url,
    generate_slug,
    get_one,
    hash_password,
    split_commas,
)
from typing import Any, NamedTuple
from sqlite3 import connect
from os.path import dirname, join
from time import time
from urllib.parse import unquote


connection = connect(join(dirname(__file__), "database.db"))
commit = connection.commit
cursor = connection.cursor()
execute = cursor.execute
executemany = cursor.executemany


execute(
    """
  CREATE TABLE IF NOT EXISTS users (
    user_id   INTEGER PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT
                      UNIQUE ON CONFLICT ROLLBACK
                      NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT (0),
    username  TEXT    UNIQUE ON CONFLICT ROLLBACK
                      NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    user_slug TEXT    UNIQUE ON CONFLICT ROLLBACK
                      NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    email     TEXT    UNIQUE ON CONFLICT ROLLBACK
                      NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    bio       TEXT    NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    avatar    TEXT    NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    salt      TEXT    NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT "",
    password  TEXT    NOT NULL ON CONFLICT ROLLBACK
                      DEFAULT ""
  )
  STRICT;
"""
)
execute(
    """
  CREATE TABLE IF NOT EXISTS articles (
    article_id    INTEGER PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT
                          UNIQUE ON CONFLICT ROLLBACK
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    user_id       INTEGER REFERENCES users (user_id) ON DELETE CASCADE
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    article_title TEXT    NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT "",
    article_slug  TEXT    UNIQUE ON CONFLICT ROLLBACK
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT "",
    article_mtime INTEGER NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    short         TEXT    NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT "",
    long          TEXT    NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT ""
  )
  STRICT;
"""
)
execute(
    """
  CREATE TRIGGER IF NOT EXISTS after_insert_article
         AFTER INSERT
            ON articles
  BEGIN
      UPDATE articles
        SET article_slug = NEW.article_slug || '-' || NEW.article_id
      WHERE article_id = NEW.article_id;
  END;
"""
)
execute(
    """
  CREATE TRIGGER IF NOT EXISTS after_update_article
         AFTER UPDATE OF article_id,
                         user_id,
                         article_title,
                         article_slug,
                         short,
                         long
            ON articles
  BEGIN
      UPDATE articles
        SET article_mtime = unixepoch()
      WHERE article_id = NEW.article_id;
  END;
"""
)
execute(
    """
  CREATE TABLE IF NOT EXISTS comments (
    comment_id    INTEGER PRIMARY KEY ON CONFLICT ROLLBACK AUTOINCREMENT
                          UNIQUE ON CONFLICT ROLLBACK
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    user_id       INTEGER REFERENCES users (user_id) ON DELETE CASCADE
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    article_id    INTEGER REFERENCES articles (article_id) ON DELETE CASCADE
                          NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0),
    comment_text  TEXT    NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT "",
    comment_ctime INTEGER NOT NULL ON CONFLICT ROLLBACK
                          DEFAULT (0)
  )
  STRICT;
"""
)
execute(
    """
  CREATE TRIGGER IF NOT EXISTS after_insert_comment
         AFTER INSERT
            ON comments
  BEGIN
      UPDATE comments
        SET comment_ctime = unixepoch()
      WHERE comment_id = NEW.comment_id;
  END;
"""
)
execute(
    """
  CREATE TABLE IF NOT EXISTS tags (
    tag_value  TEXT    NOT NULL ON CONFLICT ROLLBACK
                       DEFAULT "",
    article_id INTEGER REFERENCES articles (article_id) ON DELETE CASCADE
                       NOT NULL ON CONFLICT ROLLBACK
                       DEFAULT (0),
    PRIMARY KEY (
        tag_value,
        article_id
    )
    ON CONFLICT ROLLBACK
  )
  WITHOUT ROWID,
  STRICT;
"""
)
execute(
    """
  CREATE TABLE IF NOT EXISTS likes (
    user_id    INTEGER REFERENCES users (user_id) ON DELETE CASCADE
                       NOT NULL ON CONFLICT ROLLBACK
                       DEFAULT (0),
    article_id INTEGER REFERENCES articles (article_id) ON DELETE CASCADE
                       NOT NULL ON CONFLICT ROLLBACK
                       DEFAULT (0),
    PRIMARY KEY (
        user_id,
        article_id
    )
    ON CONFLICT ROLLBACK
  )
  WITHOUT ROWID,
  STRICT;
"""
)
execute(
    """
  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE
                        NOT NULL ON CONFLICT ROLLBACK
                        DEFAULT (0),
    followee_id INTEGER REFERENCES users (user_id) ON DELETE CASCADE
                        NOT NULL ON CONFLICT ROLLBACK
                        DEFAULT (0),
    PRIMARY KEY (
        follower_id,
        followee_id
    )
    ON CONFLICT ROLLBACK
  )
  WITHOUT ROWID,
  STRICT;
"""
)
commit()


class User(NamedTuple):
    user_id: int
    username: str
    user_slug: str
    email: str
    bio: str
    avatar: str
    total_follows: int
    is_followed: bool

    @classmethod
    def public_fields(cls):
        return ["user_id", "username", "user_slug", "email", "bio", "avatar"]

    @classmethod
    def public_sql(cls):
        return f"users.{', users.'.join(cls.public_fields())}"


class Followee(NamedTuple):
    user_id: int
    username: str
    total_follows: int
    is_followed: bool


class Article(NamedTuple):
    article_id: int
    user_id: int
    article_title: str
    article_slug: str
    article_mtime: int
    short: str
    long: str
    total_likes: int
    is_liked: bool
    author: User

    @property
    def tags(self):
        return TagController.get_article_tags(self.article_id)

    @property
    def comments(self):
        return CommentController.get_article_comments(self.article_id)

    @classmethod
    def public_fields(cls):
        return [
            "article_id",
            "user_id",
            "article_title",
            "article_slug",
            "article_mtime",
            "short",
            "long",
        ]

    @classmethod
    def public_sql(cls):
        return f"articles.{', articles.'.join(cls.public_fields())}"


class Comment(NamedTuple):
    comment_id: int
    user_id: int
    article_id: int
    comment_text: str
    comment_ctime: int
    commenter: User

    @classmethod
    def public_fields(cls):
        return [
            "comment_id",
            "user_id",
            "article_id",
            "comment_text",
            "comment_ctime",
        ]

    @classmethod
    def public_sql(cls):
        return f"comments.{', comments.'.join(cls.public_fields())}"


class UserController:

    @staticmethod
    def find(
        follower_id: int | None = None,
        followee_id: int | None = None,
        user_slug: str | None = None,
    ):
        join: list[str] = []
        join_args: list[str | int] = []
        where: list[str] = []
        where_args: list[str | int] = []
        if follower_id:
            join.append(
                """LEFT JOIN (
        SELECT follows.followee_id, COUNT(*) AS follows_count
        FROM follows
        WHERE follows.follower_id = ?
        GROUP BY follows.followee_id
      ) AS user_follows ON users.user_id = user_follows.followee_id"""
            )
            join_args.append(follower_id)
        if followee_id:
            where.append("users.user_id = ?")
            where_args.append(followee_id)
        if user_slug:
            where.append("users.user_slug = ?")
            where_args.append(user_slug)
        result = execute(
            f"""
          SELECT
            COALESCE(total_follows.follows_count, 0),
            {'COALESCE(user_follows.follows_count, 0)' if follower_id else '0'},
            {User.public_sql()}
          FROM users
          LEFT JOIN (
            SELECT follows.followee_id, COUNT(*) AS follows_count
            FROM follows
            GROUP BY follows.followee_id
          ) AS total_follows ON users.user_id = total_follows.followee_id
          {' '.join(join) if len(join) else ''}
          {f'WHERE {" AND ".join(where)}' if len(where) else ''}
        """,
            tuple(join_args + where_args),
        ).fetchone()
        if result:
            return User(
                *result[2:],
                total_follows=result[0],
                is_followed=bool(result[1]),
            )

    @staticmethod
    def insert(form_data: dict[str, list[str]]) -> tuple[int | None, list[str]]:
        errors: list[str] = []
        username = get_one(form_data, "username")
        email = get_one(form_data, "email")
        password = get_one(form_data, "password")
        if not username:
            errors.append("Username is required")
        if not email:
            errors.append("Email is required")
        if not password:
            errors.append("Password is required")
        if not username or not email or not password or len(errors):
            return None, errors
        try:
            execute(
                """
          INSERT INTO users (username, user_slug, email, avatar, salt, password)
          VALUES (?, ?, ?, ?, ?, ?)
        """,
                (
                    username,
                    generate_slug(username),
                    email,
                    generate_gravatar_url(email),
                    *hash_password(password),
                ),
            )
            commit()
        except:
            errors.append("Username or Email already taken")
            return None, errors
        return cursor.lastrowid, []

    @staticmethod
    def sign_in(
        form_data: dict[str, list[str]],
    ) -> tuple[int | None, list[str]]:
        errors: list[str] = []
        email = get_one(form_data, "email")
        password = get_one(form_data, "password")
        if not email:
            errors.append("Email is required")
        if not password:
            errors.append("Password is required")
        if not email or not password or len(errors):
            return None, errors
        result = execute(
            """
        SELECT
          users.user_id,
          users.salt,
          users.password
        FROM users
        WHERE users.email = ?
      """,
            (email,),
        ).fetchone()
        if not result:
            errors.append("Incorrect email")
            return None, errors
        if result[2] != hash_password(password, result[1])[1]:
            errors.append("Incorrect password")
            return None, errors
        return result[0], []

    @staticmethod
    def update(
        user: User | None, form_data: dict[str, list[str]]
    ) -> tuple[User | None, list[str]]:
        if not user:
            return None, ["Need to be logged in to edit settings"]
        fields: list[str] = []
        args: list[str | int] = []
        patch: dict[str, Any] = {}
        username = get_one(form_data, "username")
        email = get_one(form_data, "email")
        bio = get_one(form_data, "bio")
        avatar = get_one(form_data, "avatar")
        password = get_one(form_data, "password")
        if username:
            fields.append("username = ?")
            args.append(username)
            patch["username"] = username
            fields.append("user_slug = ?")
            user_slug = generate_slug(username)
            args.append(user_slug)
            patch["user_slug"] = user_slug
        if email:
            fields.append("email = ?")
            args.append(email)
            patch["email"] = email
            if not avatar:
                fields.append("avatar = ?")
                avt = generate_gravatar_url(email)
                args.append(avt)
                patch["avatar"] = avt
        elif avatar:
            fields.append("avatar = ?")
            args.append(avatar)
            patch["avatar"] = avatar
        if not bio:
            bio = ""
        fields.append("bio = ?")
        args.append(bio)
        patch["bio"] = bio
        if password:
            fields.append("salt = ?")
            fields.append("password = ?")
            salt, pwd = hash_password(password)
            args.append(salt)
            args.append(pwd)
        args.append(user.user_id)
        try:
            execute(
                f"""
          UPDATE users
          SET {', '.join(fields)}
          WHERE users.user_id = ?
        """,
                tuple(args),
            )
            commit()
        except:
            return None, ["Username or Email already taken"]
        return user._replace(**patch), []


class ArticleController:

    @classmethod
    def get_by_article_slug(cls, user: User | None, article_slug: str | None):
        if not article_slug:
            return
        res = cls.search(
            user.user_id if user else None, 1, article_slug=article_slug
        )
        return res[0] if len(res) else None

    @staticmethod
    def get_total_article_count() -> int:
        result = execute(
            """
        SELECT COUNT(*)
        FROM articles
      """
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def get_followed_article_count(user: User | None) -> int:
        if not user:
            return 0
        result = execute(
            """
          SELECT COUNT(*)
          FROM articles
          JOIN follows ON articles.user_id = follows.followee_id
          WHERE follows.follower_id = ?
        """,
            (user.user_id,),
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def get_tag_article_count(tag_value: str | None) -> int:
        if not tag_value:
            return 0
        result = execute(
            """
          SELECT COUNT(*)
          FROM articles
          JOIN tags ON articles.article_id = tags.article_id
          WHERE tags.tag_value = ?
        """,
            (tag_value,),
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def get_author_article_count(user: User | None) -> int:
        if not user:
            return 0
        result = execute(
            """
          SELECT COUNT(*)
          FROM articles
          WHERE articles.user_id = ?
        """,
            (user.user_id,),
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def get_liked_article_count(user: User | None) -> int:
        if not user:
            return 0
        result = execute(
            """
          SELECT COUNT(*)
          FROM likes
          WHERE likes.user_id = ?
        """,
            (user.user_id,),
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def search(
        user_id: int | None,
        page: int,
        feed: bool = False,
        tag_value: str | None = None,
        owner_id: int | None = None,
        liked: bool = False,
        article_slug: str | None = None,
    ):
        join: list[str] = []
        join_args: list[str | int] = []
        where: list[str] = []
        where_args: list[str | int] = []
        if user_id:
            join.append(
                """LEFT JOIN (
        SELECT likes.article_id, COUNT(*) AS likes_count
        FROM likes
        WHERE likes.user_id = ?
        GROUP BY likes.article_id
      ) AS user_likes ON articles.article_id = user_likes.article_id"""
            )
            join_args.append(user_id)
            join.append(
                """LEFT JOIN (
        SELECT follows.followee_id, COUNT(*) AS follows_count
        FROM follows
        WHERE follows.follower_id = ?
        GROUP BY follows.followee_id
      ) AS user_follows ON articles.user_id = user_follows.followee_id"""
            )
            join_args.append(user_id)
            if feed:
                join.append(
                    "LEFT JOIN follows ON articles.user_id = follows.followee_id"
                )
                where.append("follows.follower_id = ?")
                where_args.append(user_id)
        if tag_value:
            join.append(
                "LEFT JOIN tags ON articles.article_id = tags.article_id"
            )
            where.append("tags.tag_value = ?")
            where_args.append(tag_value)
        if owner_id:
            if liked:
                join.append(
                    """LEFT JOIN (
          SELECT likes.article_id, COUNT(*) AS likes_count
          FROM likes
          WHERE likes.user_id = ?
          GROUP BY likes.article_id
        ) AS owner_likes ON articles.article_id = owner_likes.article_id"""
                )
                join_args.append(owner_id)
                where.append("owner_likes.likes_count > 0")
            else:
                where.append("articles.user_id = ?")
                where_args.append(owner_id)
        if article_slug:
            where.append("articles.article_slug = ?")
            where_args.append(article_slug)
        sql = f"""
      SELECT
        COALESCE(total_likes.likes_count, 0),
        {'COALESCE(user_likes.likes_count, 0)' if user_id else '0'},
        COALESCE(total_follows.follows_count, 0),
        {'COALESCE(user_follows.follows_count, 0)' if user_id else '0'},
        {Article.public_sql()},
        {User.public_sql()}
      FROM articles
      JOIN users ON articles.user_id = users.user_id
      LEFT JOIN (
        SELECT likes.article_id, COUNT(*) AS likes_count
        FROM likes
        GROUP BY likes.article_id
      ) AS total_likes ON articles.article_id = total_likes.article_id
      LEFT JOIN (
        SELECT follows.followee_id, COUNT(*) AS follows_count
        FROM follows
        GROUP BY follows.followee_id
      ) AS total_follows ON articles.user_id = total_follows.followee_id
      {' '.join(join) if len(join) else ''}
      {f'WHERE {" AND ".join(where)}' if len(where) else ''}
      ORDER BY articles.article_mtime DESC
      LIMIT 10 OFFSET ?
    """
        args = tuple(join_args + where_args + [10 * (page - 1)])
        return [
            Article(
                *x[4 : 4 + len(Article.public_fields())],
                total_likes=x[0],
                is_liked=bool(x[1]),
                author=User(
                    *x[
                        4
                        + len(Article.public_fields()) : 4
                        + len(Article.public_fields())
                        + len(User.public_fields())
                    ],
                    total_follows=x[2],
                    is_followed=bool(x[3]),
                ),
            )
            for x in execute(sql, args).fetchall()
        ]

    @classmethod
    def update(
        cls,
        user: User | None,
        article_slug: str | None,
        form_data: dict[str, list[str]],
    ) -> tuple[Article | None, list[str]]:
        errors: list[str] = []
        article_title = get_one(form_data, "article_title")
        long = get_one(form_data, "long")
        tags = split_commas(get_one(form_data, "tags"))
        if not article_title:
            errors.append("Title is required")
        if not long:
            errors.append("Article text is required")
        if not len(tags):
            errors.append("At least one tag is required")
        article: Article | None = None
        if user:
            article = cls.get_by_article_slug(user, article_slug)
            if not article:
                errors.append("No article to update")
            elif article.user_id != user.user_id:
                errors.append("You can only edit your own articles")
        else:
            errors.append("Need to be logged in to edit articles")
        if not article or not article_title or not long or len(errors):
            return None, errors
        short = get_one(form_data, "short")
        max_len = 250
        suffix = "…"
        short = short if short else long
        short = (
            f"{
        short[0:max_len - len(suffix)]}{suffix}"
            if len(short) > max_len
            else short
        )
        slug = f"{generate_slug(article_title)}-{article.article_id}"
        execute(
            """
        UPDATE articles
        SET
          article_title = ?,
          article_slug = ?,
          short = ?,
          long = ?
        WHERE article_id = ?
      """,
            (article_title, slug, short, long, article.article_id),
        )
        execute(
            """
        DELETE FROM tags
        WHERE tags.article_id = ?
      """,
            (article.article_id,),
        )
        executemany(
            """
        INSERT INTO tags (tag_value, article_id)
        VALUES (?, ?)
      """,
            [(x, article.article_id) for x in tags],
        )
        commit()
        return (
            article._replace(
                article_title=article_title,
                article_slug=slug,
                short=short,
                long=long,
                article_mtime=int(time()),
            ),
            [],
        )

    @staticmethod
    def insert(
        user: User | None, form_data: dict[str, list[str]]
    ) -> tuple[Article | None, list[str]]:
        errors: list[str] = []
        article_title = get_one(form_data, "article_title")
        long = get_one(form_data, "long")
        tags = split_commas(get_one(form_data, "tags"))
        if not article_title:
            errors.append("Title is required")
        if not long:
            errors.append("Article text is required")
        if not len(tags):
            errors.append("At least one tag is required")
        if not user:
            errors.append("Need to be logged in to post articles")
        if not user or not article_title or not long or len(errors):
            return None, errors
        slug = generate_slug(article_title)
        short = get_one(form_data, "short")
        max_len = 250
        suffix = "…"
        short = short if short else long
        short = (
            f"{
        short[0:max_len - len(suffix)]}{suffix}"
            if len(short) > max_len
            else short
        )
        execute(
            """
        INSERT INTO articles (user_id, article_title, article_slug, short, long)
        VALUES (?, ?, ?, ?, ?)
      """,
            (user.user_id, article_title, slug, short, long),
        )
        commit()
        article_id = cursor.lastrowid
        if article_id:
            executemany(
                """
          INSERT INTO tags (tag_value, article_id)
          VALUES (?, ?)
        """,
                [(x, article_id) for x in tags],
            )
            commit()
            return (
                Article(
                    article_id,
                    user.user_id,
                    article_title,
                    f"{slug}-{article_id}",
                    int(time()),
                    short,
                    long,
                    0,
                    False,
                    user,
                ),
                [],
            )
        return None, ["Failed to create an article"]

    @staticmethod
    def remove(user: User | None, article_id: int):
        if not user:
            return "Need to be logged in to remove an article"
        execute(
            """
        DELETE FROM articles
        WHERE articles.article_id = ?
        AND articles.user_id = ?
      """,
            (article_id, user.user_id),
        )
        commit()
        if cursor.rowcount < 1:
            return "No article removed"


class TagController:

    @staticmethod
    def get_most_popular_count() -> int:
        result = execute(
            """
        SELECT COUNT(*)
        FROM (
          SELECT COUNT(*) AS found
          FROM tags
          GROUP BY tags.tag_value
          ORDER BY found DESC
          LIMIT 10
        )
      """
        ).fetchone()
        return result[0] if result else 0

    @staticmethod
    def get_most_popular() -> list[str]:
        return [
            x
            for x, _ in execute(
                """
        SELECT tags.tag_value, COUNT(*) AS found
        FROM tags
        GROUP BY tags.tag_value
        ORDER BY found
        DESC LIMIT 10
      """
            ).fetchall()
        ]

    @staticmethod
    def get_article_tags(article_id: int) -> list[str]:
        return [
            x[0]
            for x in execute(
                """
        SELECT tags.tag_value
        FROM tags
        WHERE tags.article_id = ?
        ORDER BY tags.tag_value
      """,
                (article_id,),
            ).fetchall()
        ]


class CommentController:

    @staticmethod
    def get_article_comments(article_id: int):
        return [
            Comment(
                *x[0 : len(Comment.public_fields())],
                commenter=User(
                    *x[len(Comment.public_fields()) :],
                    # can't follow a commenter
                    total_follows=0,
                    is_followed=False,
                ),
            )
            for x in execute(
                f"""
        SELECT
          {Comment.public_sql()},
          {User.public_sql()}
        FROM comments
        JOIN users ON comments.user_id = users.user_id
        WHERE comments.article_id = ?
      """,
                (article_id,),
            ).fetchall()
        ]

    @classmethod
    def insert(
        cls, user: User | None, article_id: int, form_data: dict[str, list[str]]
    ) -> tuple[Comment | None, list[str]]:
        errors: list[str] = []
        comment_text = get_one(form_data, "comment_text")
        if not comment_text:
            errors.append("Comment cannot be empty")
        if not user:
            errors.append("Need to be logged in to comment")
        if not comment_text or not user or len(errors):
            return None, errors
        execute(
            """
        INSERT INTO comments (user_id, article_id, comment_text)
        SELECT ?, articles.article_id, ?
        FROM articles
        WHERE articles.article_id = ?
      """,
            (user.user_id, comment_text, article_id),
        )
        commit()
        comment_id = cursor.lastrowid
        if comment_id:
            return (
                Comment(
                    comment_id,
                    user.user_id,
                    article_id,
                    comment_text,
                    int(time()),
                    user,
                ),
                [],
            )
        errors.append("No article found to comment on")
        return None, errors

    @staticmethod
    def remove(user: User | None, comment_id: int):
        if not user:
            return "Need to be logged in to remove a comment"
        execute(
            """
        DELETE FROM comments
        WHERE comments.comment_id = ?
        AND comments.user_id = ?
      """,
            (comment_id, user.user_id),
        )
        commit()
        if cursor.rowcount < 1:
            return "No comment removed"


class LikeController:

    @staticmethod
    def insert(
        user: User | None, article_id: int
    ) -> tuple[dict[str, Any] | None, str]:
        if not user:
            return None, "Need to be logged in to add an article to favorites"
        try:
            execute(
                """
          INSERT INTO likes (user_id, article_id)
          VALUES (?, ?)
        """,
                (user.user_id, article_id),
            )
            commit()
        except:
            return None, "No article added to favorites"
        result = execute(
            """
        SELECT COUNT(*)
        FROM likes
        WHERE likes.article_id = ?
      """,
            (article_id,),
        ).fetchone()
        return {
            "article_id": article_id,
            "total_likes": result[0] if result else 0,
            "is_liked": True,
        }, ""

    @staticmethod
    def remove(
        user: User | None, article_id: int
    ) -> tuple[dict[str, Any] | None, str]:
        if not user:
            return (
                None,
                "Need to be logged in to remove an article from favorites",
            )
        execute(
            """
        DELETE FROM likes
        WHERE likes.user_id = ?
        AND likes.article_id = ?
      """,
            (user.user_id, article_id),
        )
        commit()
        if cursor.rowcount < 1:
            return None, "No like removed"
        result = execute(
            """
        SELECT COUNT(*)
        FROM likes
        WHERE likes.article_id = ?
      """,
            (article_id,),
        ).fetchone()
        return {
            "article_id": article_id,
            "total_likes": result[0] if result else 0,
            "is_liked": False,
        }, ""


class FollowController:

    @staticmethod
    def insert(
        user: User | None, user_id: int
    ) -> tuple[dict[str, Any] | None, str]:
        if not user:
            return None, "Need to be logged in to follow a user"
        try:
            execute(
                """
          INSERT INTO follows (follower_id, followee_id)
          VALUES (?, ?)
        """,
                (user.user_id, user_id),
            )
            commit()
        except:
            return None, "No user followed"
        result = execute(
            """
        SELECT
          COUNT(follows.followee_id),
          users.username
        FROM users
        LEFT JOIN follows ON users.user_id = follows.followee_id
        WHERE users.user_id = ?
      """,
            (user_id,),
        ).fetchone()
        return {
            "author": Followee(
                user_id,
                result[1] if result else "",
                result[0] if result else 0,
                True,
            )
        }, ""

    @staticmethod
    def remove(
        user: User | None, user_id: int
    ) -> tuple[dict[str, Any] | None, str]:
        if not user:
            return None, "Need to be logged in to unfollow a user"
        execute(
            """
        DELETE FROM follows
        WHERE follows.follower_id = ?
        AND follows.followee_id = ?
      """,
            (user.user_id, user_id),
        )
        commit()
        if cursor.rowcount < 1:
            return None, "No follow removed"
        result = execute(
            """
        SELECT
          COUNT(follows.followee_id),
          users.username
        FROM users
        LEFT JOIN follows ON users.user_id = follows.followee_id
        WHERE users.user_id = ?
      """,
            (user_id,),
        ).fetchone()
        return {
            "author": Followee(
                user_id,
                result[1] if result else "",
                result[0] if result else 0,
                False,
            )
        }, ""


class Handler(BaseHandler):

    SECRET = "example_secret"

    DATETIME_FORMAT = "%a %b %d %Y"

    ROUTES = [
        ("icon", "/favicon.ico"),
        ("js", "/keml.js"),
        ("home", "/"),
        ("login", "/login"),
        ("register", "/register"),
        ("settings", "/settings"),
        ("split_chips", "/split-chips"),
        ("feed", "/feed"),
        ("create", "/editor"),
        ("favorites", "/profile/{slug}/favorites"),
        ("favorites_pages", "/profile/{slug}/favorites/{page}"),
        ("profile_pages", "/profile/{slug}/{page}"),
        ("tag_pages", "/tag/{tag}/{page}"),
        ("tag", "/tag/{tag}"),
        ("profile", "/profile/{slug}"),
        ("article", "/article/{slug}"),
        ("article_id", "/article-id/{id}"),
        ("feed_pages", "/feed/{page}"),
        ("editor", "/editor/{slug}"),
        ("comment", "/comment/{id}"),
        ("like", "/like/{id}"),
        ("follow", "/follow/{id}"),
        ("home_pages", "/{page}"),
    ]

    def set_user(self, user_id: int):
        self.user = UserController.find(followee_id=user_id)

    @property
    def ctx_tag(self):
        tag = self.parsed_params.get("tag")
        return unquote(tag) if tag is not None else tag

    @property
    def ctx_slug(self):
        return self.parsed_params.get("slug")

    @property
    def ctx_page(self):
        param = self.parsed_params.get("page")
        return int(param) if param and param.isdecimal() else -1 if param else 1

    @property
    def ctx_id(self):
        param = self.parsed_params.get("id")
        return int(param) if param and param.isdecimal() else -1 if param else 1

    @property
    def ctx_author(self):
        return UserController.find(
            follower_id=self.user.user_id if self.user else None,
            user_slug=self.ctx_slug,
        )

    @property
    def ctx_popular_tag_count(self):
        return TagController.get_most_popular_count()

    @property
    def ctx_total_article_count(self):
        return ArticleController.get_total_article_count()

    @property
    def ctx_followed_article_count(self):
        return ArticleController.get_followed_article_count(self.user)

    @property
    def ctx_tag_article_count(self):
        return ArticleController.get_tag_article_count(self.ctx_tag)

    @property
    def ctx_author_article_count(self):
        return ArticleController.get_author_article_count(self.ctx_author)

    @property
    def ctx_liked_article_count(self):
        return ArticleController.get_liked_article_count(self.ctx_author)

    @property
    def ctx_popular_tags(self):
        return TagController.get_most_popular()

    @property
    def ctx_global_articles(self):
        return ArticleController.search(
            self.user.user_id if self.user else None, self.ctx_page
        )

    @property
    def ctx_feed_articles(self):
        return ArticleController.search(
            self.user.user_id if self.user else None, self.ctx_page, feed=True
        )

    @property
    def ctx_tag_articles(self):
        return ArticleController.search(
            self.user.user_id if self.user else None,
            self.ctx_page,
            tag_value=self.ctx_tag,
        )

    @property
    def ctx_author_articles(self):
        return ArticleController.search(
            self.user.user_id if self.user else None,
            self.ctx_page,
            owner_id=self.ctx_author.user_id if self.ctx_author else None,
        )

    @property
    def ctx_liked_articles(self):
        return ArticleController.search(
            self.user.user_id if self.user else None,
            self.ctx_page,
            owner_id=self.ctx_author.user_id if self.ctx_author else None,
            liked=True,
        )

    def get_icon(self):
        self.send_file(self.base_name)

    def get_js(self):
        self.send_file(f"../../{self.base_name}")

    def get_404(self):
        self.send_tpl("index", 404, content="404")

    def get_404_xhr(self):
        self.send_tpl("content", 404, content="404")

    def get_home(self):
        if self.ctx_page == -1:
            self.get_404()
        else:
            self.send_tpl("index", content="home")

    def get_home_xhr(self):
        if self.ctx_page == -1:
            self.get_404_xhr()
        else:
            self.send_tpl("content", content="home")

    def get_home_pages(self):
        self.get_home()

    def get_home_pages_xhr(self):
        self.get_home_xhr()

    def get_feed(self):
        self.response_headers.append(("Location", self.url("login")))
        self.send_status(302)

    def get_feed_auth(self):
        self.get_home()

    def get_feed_xhr(self):
        self.get_login_xhr()

    def get_feed_xhr_auth(self):
        self.get_home_xhr()

    def get_feed_pages(self):
        self.response_headers.append(("Location", self.url("login")))
        self.send_status(302)

    def get_feed_pages_auth(self):
        self.get_home()

    def get_feed_pages_xhr(self):
        self.get_login_xhr()

    def get_feed_pages_xhr_auth(self):
        self.get_home_xhr()

    def get_tag(self):
        self.get_home()

    def get_tag_xhr(self):
        self.get_home_xhr()

    def get_tag_pages(self):
        self.get_home()

    def get_tag_pages_xhr(self):
        self.get_home_xhr()

    def get_profile(self):
        if self.ctx_page == -1 or not self.ctx_author:
            self.get_404()
        else:
            self.send_tpl("index", content="profile")

    def get_profile_xhr(self):
        if self.ctx_page == -1 or not self.ctx_author:
            self.get_404_xhr()
        else:
            self.send_tpl("content", content="profile")

    def get_profile_pages(self):
        self.get_profile()

    def get_profile_pages_xhr(self):
        self.get_profile_xhr()

    def get_favorites(self):
        self.get_profile()

    def get_favorites_xhr(self):
        self.get_profile_xhr()

    def get_favorites_pages(self):
        self.get_profile()

    def get_favorites_pages_xhr(self):
        self.get_profile_xhr()

    def get_login(self):
        self.send_tpl("index", content="auth")

    def get_login_xhr(self):
        self.send_tpl("content", content="auth", active_route="login")

    def get_register(self):
        self.send_tpl("index", content="auth")

    def get_register_xhr(self):
        self.send_tpl("content", content="auth")

    def get_create(self):
        self.response_headers.append(("Location", self.url("login")))
        self.send_status(302)

    def get_create_auth(self):
        self.send_tpl(
            "index",
            content="editor",
            article_slug="",
            article_title="",
            short="",
            long="",
            tags=[],
        )

    def get_create_xhr(self):
        self.get_login_xhr()

    def get_create_xhr_auth(self):
        self.send_tpl(
            "content",
            content="editor",
            article_slug="",
            article_title="",
            short="",
            long="",
            tags=[],
        )

    def get_editor(self):
        self.response_headers.append(("Location", self.url("login")))
        self.send_status(302)

    def get_editor_auth(self):
        article = ArticleController.get_by_article_slug(
            self.user, self.ctx_slug
        )
        if article:
            self.send_tpl("index", content="editor", **asdict(article))
        else:
            self.get_404()

    def get_editor_xhr(self):
        self.get_login_xhr()

    def get_editor_xhr_auth(self):
        article = ArticleController.get_by_article_slug(
            self.user, self.ctx_slug
        )
        if article:
            self.send_tpl("index", content="editor", **asdict(article))
        else:
            self.get_404_xhr()

    def get_settings(self):
        self.response_headers.append(("Location", self.url("login")))
        self.send_status(302)

    def get_settings_auth(self):
        self.send_tpl("index", content="settings")

    def get_settings_xhr(self):
        self.get_login_xhr()

    def get_settings_xhr_auth(self):
        self.send_tpl("content", content="settings")

    def get_article(self):
        article = ArticleController.get_by_article_slug(
            self.user, self.ctx_slug
        )
        if article:
            self.send_tpl("index", content="article", **asdict(article))
        else:
            self.get_404()

    def get_article_xhr(self):
        article = ArticleController.get_by_article_slug(
            self.user, self.ctx_slug
        )
        if article:
            self.send_tpl("content", content="article", **asdict(article))
        else:
            self.get_404_xhr()

    def post_login(self):
        user_id, errors = UserController.sign_in(self.parsed_data)
        if user_id:
            self.sign_in(user_id)
        else:
            self.send_tpl("formMessages", 400, messages=errors)

    def post_register(self):
        user_id, errors = UserController.insert(self.parsed_data)
        if user_id:
            self.sign_in(user_id)
        else:
            self.send_tpl("formMessages", 400, messages=errors)

    def post_settings(self):
        user, errors = UserController.update(self.user, self.parsed_data)
        if user:
            self.user = user
            self.send_tpl("settingsForm")
        else:
            self.send_tpl("formMessages", 400, messages=errors)

    def post_split_chips(self):
        self.send_tpl(
            "chips", tags=split_commas(self.single_parsed_data("tags"))
        )

    def post_comment(self):
        comment, errors = CommentController.insert(
            self.user, self.ctx_id, self.parsed_data
        )
        if comment:
            self.send_tpl("comment", **asdict(comment))
        else:
            self.send_strings(errors, 400)

    def post_create(self):
        article, errors = ArticleController.insert(self.user, self.parsed_data)
        if article:
            self.send_tpl("editorForm", **asdict(article))
        else:
            self.send_tpl("formMessages", 400, messages=errors)

    def post_editor(self):
        article, errors = ArticleController.update(
            self.user, self.ctx_slug, self.parsed_data
        )
        if article:
            self.send_tpl("editorForm", **asdict(article))
        else:
            self.send_tpl("formMessages", 400, messages=errors)

    def post_like(self):
        article, error = LikeController.insert(self.user, self.ctx_id)
        if article:
            self.send_tpl(
                "likeButton", label=self.single_parsed_query("label"), **article
            )
        else:
            self.send_string(error, 400)

    def post_follow(self):
        article, error = FollowController.insert(self.user, self.ctx_id)
        if article:
            self.send_tpl("followButton", **article)
        else:
            self.send_string(error, 400)

    def delete_like(self):
        article, error = LikeController.remove(self.user, self.ctx_id)
        if article:
            self.send_tpl(
                "likeButton", label=self.single_parsed_query("label"), **article
            )
        else:
            self.send_string(error, 400)

    def delete_follow(self):
        article, error = FollowController.remove(self.user, self.ctx_id)
        if article:
            self.send_tpl("followButton", **article)
        else:
            self.send_string(error, 400)

    def delete_login(self):
        self.sign_out()

    def delete_split_chips(self):
        self.send_tpl(
            "articleTags", tags=split_commas(self.single_parsed_query("chip"))
        )

    def delete_comment(self):
        error = CommentController.remove(self.user, self.ctx_id)
        if error:
            self.send_string(error, 400)

    def delete_article_id(self):
        error = ArticleController.remove(self.user, self.ctx_id)
        if error:
            self.send_string(error, 400)


Server(("127.0.0.1", 8080), Handler).start(connection.close)
