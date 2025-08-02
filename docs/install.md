# Installation

KEML is designed to be ultra-simple to use — there is no programmatic API, no
JavaScript exports, and no setup or configuration required.

Simply include the library via CDN in your HTML:

```html
<script src="https://unpkg.com/keml"></script>
```

Alternatively, if you prefer to manage dependencies locally or bundle KEML with
your project, you can install it using npm:

```bash
npm install keml
```

The compiled bundle `keml.js` will be available at the root of the installed
package.

## Using KEML with Other Libraries and Frameworks

KEML automatically observes all DOM changes, so you don’t need to do anything
special to integrate it.

Whenever your application dynamically creates or updates elements, KEML will
seamlessly handle them just like elements rendered on the server.

This makes KEML compatible with virtually any frontend framework or custom
JavaScript code without extra setup.
