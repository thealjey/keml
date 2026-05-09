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

## Demos

All interactive demos in this documentation run on the real KEML runtime.

Each demo is split into three tabs:

- HTML — the client program
- Server — the server program
- Result — the running application produced by executing both programs

The HTML and Server tabs contain the actual programs used to produce the Result
tab.

You can also explore the
[examples](https://github.com/thealjey/keml/tree/main/examples)
folder on GitHub.
