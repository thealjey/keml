Simple systems are easy to maintain. Large ones are not.

As applications grow, complexity accumulates. Logic spreads across layers, state
has to be coordinated, and small changes become harder to reason about.

At some point, many projects reach a level of complexity where rewriting feels
like the only viable option. The rewrite works, briefly, because the system is
small again. Then it grows, and the same repeats.

---

## In comes [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS)

KEML (and HTMX) are often misread as just another way to query a server.

That misses the actual shift:

- application data and logic exist only on the server
- UI is generated from server responses
- there is no UI state at all

KEML removes the sources of complexity instead of managing them — frontend
complexity does not exist, because the frontend itself doesn't.

The server can still be complex, but its model is inherently constrained: each
request starts from nothing, produces a response, and terminates — every
interaction is finite.

---

## So, what's wrong with HTMX?

Nothing. Nothing at all.

But, it is different enough that no amount of plugins can turn it into KEML.

---

## Defining characteristic

What makes KEML special is the way that elements communicate with each other -
they simply do not.

There are no selectors and no way to reference another element.

Each element only configures itself, its own inputs and outputs, and does not
know where the inputs are coming from or where the outputs go.

Every element in KEML conceptually boils down to the following type signature:
`Array<(action: string) => string[]>`, a collection of functions that each take
one action string and produce zero or more action strings.

Thus, interactions are naturally many-to-many.

---

Still confused? - Awesome 😀
