![Logo](docs/img/logo192.png)

# KEML

**KEML — Actions over abstractions.**  
*Enhance HTML with expressive, declarative attributes that connect your frontend
directly to your server logic.*

![min+gzip](https://img.shields.io/badge/min%2Bgzip-3.3kb-brightgreen)
![Latest Release](https://img.shields.io/npm/v/keml)
![License](https://img.shields.io/github/license/thealjey/keml)
![Open Issues](https://img.shields.io/github/issues/thealjey/keml)
![Open PRs](https://img.shields.io/github/issues-pr/thealjey/keml)
[![Docs](https://img.shields.io/badge/docs-online-blue)](https://thealjey.github.io/keml/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code%20Extension-online-blue)](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode)

KEML is a modern HTML extension that adds powerful, declarative attributes to
standard markup. With KEML, you define behaviors such as form submission,
navigation, state transitions, and conditional rendering directly in your HTML
— all handled by the server. There's no client-side JavaScript to write, manage, 
or debug. Just clean, maintainable, server-driven apps.

KEML builds on the core idea that HTML can drive your application's behavior.
Inspired by the elegance of HTMX (https://htmx.org), KEML takes that vision
further — removing limitations, embracing composability, and keeping everything 
within your markup.

No selectors. No JavaScript. No surprises.  
Just expressive, maintainable, declarative HTML.

After years of building large-scale enterprise apps with various JavaScript
frameworks, I grew frustrated.  
These tools, while powerful, come with overwhelming infrastructure demands and
duplicated logic across server and client.  
They inevitably slow down as the app grows — no matter how much you
optimize.  
Projects reach a point where rewriting feels like the only way forward, again
and again.

I built KEML to break this cycle.  
It lets you build dynamic, responsive frontends without ever writing JavaScript.  
The server remains the single source of truth. The frontend becomes fully 
declarative. Complexity vanishes, and frontend performance can never, even in 
theory, degrade over time.

It’s not a framework. It’s not magic. It’s just a better way to structure the
relationship between your HTML and your backend.

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
<button on:click="submit notify">Submit</button>

<!-- Input posts data and labels the response -->
<input on="submit" post="/api" name="email" result="response">

<!-- Render response in different positions -->
<div render="response" position="replaceWith"></div>
<p render="response" position="append"></p>
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
- ⚙️ KEML powers fully interactive apps using just HTML — no client-side logic,
  no build steps, no complexity.
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
