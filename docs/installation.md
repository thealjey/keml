KEML is designed to be ultra simple to use — there is no programmatic API, no
JavaScript exports, and no setup or configuration required.

First, install the
[official KEML extension](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode)
from the VS Code Marketplace if you haven't already.

Then, simply include the library via CDN in your HTML:

```html
<script src="https://unpkg.com/keml"></script>
```

Alternatively, if you prefer to manage dependencies locally or bundle KEML with
your project, install it using npm:

```bash
npm install keml
```

The compiled bundle, `keml.js`, will be available at the root of the installed
package.

---

## Using KEML with Other Libraries and Frameworks

KEML observes DOM changes, so you don’t need to do anything special to integrate
it with your app.

Whenever your application dynamically creates or updates elements, KEML will
seamlessly handle them just like elements rendered on the server.

This makes KEML compatible with virtually any front-end framework or custom
JavaScript code, without any extra setup.

---

## Extensibility

There is deliberately no extension mechanism.

The focus is on providing general-purpose building blocks rather than dedicated
solutions for individual use cases.

Following the HATEOAS philosophy, application state and logic belong on the
server, while the client is responsible for presenting the application and
handling interactions.

Ideally, you shouldn't have to write any client-side JavaScript at all. If you
find yourself needing it to implement application behavior, that may indicate a
missing feature rather than an inherent limitation of the platform.

It's just HTML. Nothing changes about how you use HTML or JavaScript, with or
without KEML. You can still listen to the same events, write your own
JavaScript, or integrate other libraries to supplement the existing behavior.

However, if you find yourself needing functionality that you believe could be
useful to others as well, consider requesting it on
[GitHub](https://github.com/thealjey/keml/issues/). If it makes sense as a
general-purpose feature, it can be added to the library itself.

---

## Demos

All interactive demos in this documentation run on the real KEML runtime.

Each demo is split into three tabs:

- HTML — the client program
- Server — the server program
- Result — the running application produced by executing both programs

The HTML and Server tabs contain the actual programs used to produce the Result
tab.

The server code shown in demos is not part of KEML. It runs in an in-memory
execution environment provided solely to demonstrate the client behavior.

KEML is server agnostic. Any system capable of sending text over HTTP is
compatible with KEML.

You can also explore the
[examples](https://github.com/thealjey/keml/tree/main/examples)
folder on GitHub.
