![Logo](docs/img/logo192.png)

# KEML

**KEML — Actions over abstractions.**  
*Enhance HTML with expressive, declarative attributes that connect your frontend
directly to your server logic.*

![min+gzip](https://img.shields.io/badge/min%2Bgzip-4kb-brightgreen)
![Latest Release](https://img.shields.io/npm/v/keml)
![License](https://img.shields.io/github/license/thealjey/keml)
![Open Issues](https://img.shields.io/github/issues/thealjey/keml)
![Open PRs](https://img.shields.io/github/issues-pr/thealjey/keml)
[![Docs](https://img.shields.io/badge/docs-online-blue)](https://thealjey.github.io/keml/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code%20Extension-online-blue)](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode)

Behavior such as form submission, navigation, and rendering is defined entirely
in markup and handled by the server.

No client-side JavaScript, state, or virtual DOM is required — the browser
simply renders server responses.  
No selectors. No surprises. Just expressive, maintainable, declarative HTML.

Simple systems are easy to maintain. Large ones are not.

As applications grow, complexity accumulates. Logic spreads across layers, state
has to be coordinated, and small changes become harder to reason about.

At some point, many projects reach a level of complexity where rewriting feels
like the only viable option. The rewrite works — briefly — because the system is
small again. Then it grows, and the same repeats.

I’ve been through this cycle more times than I would care to admit.

KEML is built to avoid this on the frontend. It removes the sources of
complexity instead of managing them — frontend complexity does not exist,
because the frontend itself doesn't.

The server can still be complex, but its model is inherently constrained: each
request starts from nothing, produces a response, and terminates — every
interaction is finite.

SPAs without a frontend — that’s KEML. Dynamic, responsive apps entirely
declarative in HTML, without writing any JavaScript.

---

## ✨ Why KEML?

HTMX showed the world that HTML could do more.
KEML is what happens when you fully embrace that idea — and remove all friction.

- 🔄 Multiple actions per action source (e.g. event)
- 🎯 Decoupled actions, requests, and rendering
- 🧠 Reusable naming for response handling
- 🧩 No IDs, selectors, or tightly coupled components
- ⚡️ Fully declarative logic — powered by HTML attributes
- ✅ Built-in conditional behaviors

---

## 📦 Installation

### VS Code Extension

The official KEML VS Code extension improves your workflow with:

- 📖 Documentation for all attributes and values
- ⚡ Autocompletion
- 🔗 Jump to definition and references
- 🛠️ Diagnostics to catch common mistakes

[Install the extension from the Marketplace](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode)

### KEML Runtime

Drop KEML into any HTML page — no build tools or configuration required.

Install via NPM:
```bash
npm install keml
```
Or use directly in the browser:
```html
<script src="https://unpkg.com/keml"></script>
```
That’s it. No build tools, configs, or JavaScript required.

---

## 🔍 Example

KEML replaces complex selector wiring with clear, modular declarations:
```html
<!-- Button triggers multiple actions -->
<button on:click="notify submit">Submit</button>
<!-- Input posts data and labels the response -->
<input name="email" on="submit" post="/api" result="response">
<!-- Render response in different positions -->
<div position="replaceWith" render="response"></div>
<p position="append" render="response"></p>
```

In this example:

- Multiple actions (submit, notify) can be triggered by a single event
- Multiple elements can respond to the same named action in different ways
- Logic flows from events to actions, requests, responses, and rendering
- No JavaScript, IDs, or selectors involved

---

## ⚙️ Core Attributes

| Attribute              | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| on:event               | Triggers one or more named actions                       |
| on                     | Listens for named actions from any source                |
| get, post, put, delete | Sends a request when triggered                           |
| result                 | Labels the response with a reusable name                 |
| render                 | Renders a named result                                   |
| position               | Controls how content is inserted (replace, append, etc.) |
| if:*                   | Conditional triggers such as if:value, if:loading, etc.  |

---

## 💡 Philosophy

KEML is built on a simple principle:

"Let HTML describe what should happen. Let the server decide how."

Rather than tying behaviors to fixed elements with hardcoded selectors, KEML
lets you declare named behaviors (actions) that can be referenced from anywhere.
This makes your code simpler, reduces repetition, and scales easily.

---

## 📚 See It in Action

- 🧪 Dive into real examples — every demo in the
  [/examples](https://github.com/thealjey/keml/tree/main/examples) folder is
  built with **pure framework-less Python**, and **zero JavaScript**.
- ⚙️ KEML powers fully interactive apps using just HTML — requires only a
  running HTTP server.
- 📖 Curious how it works? [Read the full docs](https://thealjey.github.io/keml)
  and see how KEML keeps your frontend declarative and your backend in control.

---

## ❤️ Inspired by HTMX

KEML exists thanks to the path paved by HTMX.
If you’ve ever used HTMX and wished for more flexibility, cleaner semantics, or 
fewer plugin dependencies — KEML is for you.

It’s not a replacement — it’s an evolution.

---

## 🙌 Contribute

KEML is still growing, and your feedback helps shape its future.

- Found a bug? [Open an issue](https://github.com/thealjey/keml/issues)
- Have ideas? Share them — or submit a PR
- Using KEML in a project? Let us know!
