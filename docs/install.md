# Installation

There is no programmatic API, nothing is exported in JS, nothing to install or
configure.

You load the library from a CDN and forget that JS even existed at all.

```html
<script src="https://unpkg.com/keml"></script>
```

## Using with other libraries and frameworks

There's also nothing special that you need to do here.

KEML automatically observes all changes to the DOM.

That means that your custom code can simply create elements and update their
attributes at any point, and they will continue to work with KEML exactly the
same as if they were rendered on the server.
