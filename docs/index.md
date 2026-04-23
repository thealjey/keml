# KEML

**KEML — Actions over abstractions.**  
*Enhance HTML with expressive, declarative attributes that connect your frontend
directly to your server logic.*

![min+gzip](https://img.shields.io/badge/min%2Bgzip-4.2kb-brightgreen)
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

## Motivation

Being small, fast, and configuration/plugin-free is not enough when competing
with a well-established, popular library.

#### So, why does KEML need to exist?

KEML was born out of the classic 1-to-1 problem of the traditional jQuery-esque
web application, which the HTMX API does nothing to address.

Consider the following "idiomatic" HTMX code:

```html
<button
  hx-post="/clicked"
  hx-swap="innerHTML"
  hx-target="#result"
  hx-trigger="click"
>Click Me!</button>
<div id="result"></div>
```

Here, the button element:

1. can only react to exactly 1 event ("click")
1. can only do 1 thing when that event happens (send a request to "/clicked")
1. cannot delegate the request-sending to some other element/-s
1. can only render the result into 1 (usually) target element
1. has to know where that element is on the page, what its "id" and/or "class"
   attributes are
1. has to decide for the target element the exact "hx-swap", of which there can
   only be 1

Out of these limitations arise:

1. the need for a custom selector syntax built on top of the normal
   css-selector syntax
1. the need for selectors in the first place, which you need to learn and
   understand to use the library effectively
1. the implicit special handling of certain elements, like title and meta,
   present in the server response
1. out of band swaps
1. response selectors
1. "hx-preserve"
1. etc, etc, etc...

All of these are meant to solve real, tangible application needs, but in the
process they over-complicate things that do not need to be complicated.

#### How is KEML different?

Consider the following KEML code that works with the same backend:

```html
<html>
  <head>
    <title render="result"></title>
  </head>
  <body>
    <button
      on:click="doSomethingElse handleClick"
      on:dblclick="handleDoubleClick"
    >Click Me!</button>
    <button on:click="handleClick">Click Me, maybe?!</button>
    <input
      name="input1"
      on="handleClick"
      post="/clicked"
      result="result"
      type="text"
    >
    <input name="input2" on="handleClick" put="/notification" type="text">
    <div position="replaceWith" render="result"></div>
    <p position="append" render="result"></p>
  </body>
</html>
```

1. both buttons initiate the same "handleClick" action on "click"
1. the first button actually initiates two independent actions on "click", that
   could both do completely different things
1. the first button also reacts to the double click event
1. neither button needs to know how those actions are handled, if at all
1. the two text inputs both handle the "handleClick" action, but send
   completely different requests
1. the first input gives the server response a render-able name "result"
1. neither input knows anything about rendering — whether anything will be
   rendered, where and how
1. the div, p and title elements render the same server response differently
1. the div will be completely replaced with the response
1. the p will append the response after its last child
1. the title will replace all of its children with the response
1. there is nothing special about the title element at all
1. there's no need for ids, classes or selectors and the location of each
   element in the document is completely unimportant

None of the problems that HTMX tries to solve with the complications listed
above even exist in this paradigm!
