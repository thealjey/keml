| Name                                      | Applied With | Description                                       |
| ----------------------------------------- | ------------ | ------------------------------------------------- |
| `action`, `get`, `href`, `src`            | `on` / `sse` | endpoint override                                 |
| `behavior`                                | `scroll`     | scroll animation                                  |
| `credentials`                             | `on` / `sse` | credentials for cross-domain communication        |
| `debounce`                                | `on`         | debounce the `on` feature                         |
| `delete`, `post`, `put`                   | `on` / `sse` | endpoint and method override                      |
| `error`                                   | `on`         | result action output channel                      |
| `event:<event>`                           | `on:<event>` | block an event action output channel              |
| `h-<header>`                              | `on`         | request header                                    |
| `if:error`, `if:loading`                  | `on`         | state action output channel                       |
| `if:intersects`, `if:invalid`, `if:value` | \*           | state action output channel                       |
| `if`                                      | \*           | state action input channel                        |
| `key`                                     | \*           | element identification for the DOM patcher        |
| `left`                                    | `scroll`     | scroll horizontal offset                          |
| `log`                                     | \*           | enables logging                                   |
| `method`                                  | `on`         | method override                                   |
| `on:<event>`                              | \*           | event action output channel                       |
| `on`                                      | \*           | event action input channel for sending requests   |
| `once`                                    | `on`         | `on` removed after first use                      |
| `position`                                | `render`     | render position                                   |
| `redirect`                                | `on`         | send redirects instead of requests                |
| `relative`                                | `scroll`     | use relative scroll offsets                       |
| `render`                                  | \*           | result action input channel                       |
| `reset`                                   | \*           | event action input channel for resetting elements |
| `result`                                  | `on` / `sse` | result action output channel                      |
| `scroll`                                  | \*           | event action input channel for scrolling elements |
| `sse`                                     | \*           | SSE event type                                    |
| `throttle`                                | `on`         | throttle the `on` feature                         |
| `top`                                     | `scroll`     | scroll vertical offset                            |
| `x-<attribute>`                           | `if`         | state condition reactive switch                   |
