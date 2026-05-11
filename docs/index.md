# KEML

**KEML — Actions over abstractions.**  
_Enhance HTML with expressive, declarative attributes that connect your frontend
directly to your server logic._

![min+gzip](https://img.shields.io/badge/min%2Bgzip-4.6kb-brightgreen)
![Latest Release](https://img.shields.io/npm/v/keml)
![License](https://img.shields.io/github/license/thealjey/keml)
![Open Issues](https://img.shields.io/github/issues/thealjey/keml)
![Open PRs](https://img.shields.io/github/issues-pr/thealjey/keml)
[![Docs](https://img.shields.io/badge/docs-online-blue)](https://thealjey.github.io/keml/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code%20Extension-online-blue)](https://marketplace.visualstudio.com/items?itemName=eugene-kuzmenko.keml-vscode)

---

<noscript>
  <div class="admonition warning">
    <p class="admonition-title">Warning</p>
    <p>JavaScript is disabled.</p>
    <p>Thou shalt not pass.</p>
    <p>But, seriously, lots of things will be broken. Go enable it first!</p>
  </div>
</noscript>

<!-- prettier-ignore-start -->
```html
<button
  on:click="submitDiv"
>
  Click me!
</button>

<!-- I promise, I am a form element ;) -->
<div
  on="submitDiv"
  name="weirdDiv"
  value="hello"
  result="serverSaysHi"
></div>

<!-- I will be overwritten -->
<p
  render="serverSaysHi"
  position="replaceWith"
></p>

<!-- yep, nothing special here -->
<title render="serverSaysHi"></title>
```
<!-- prettier-ignore-end -->

---

Curious? Confused? - Great!  
There is plenty of other pages to read 😀
