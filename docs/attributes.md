| Name                                      | Applied With               | Description                                       |
| ----------------------------------------- | -------------------------- | ------------------------------------------------- |
| `action`, `get`, `href`, `src`            | `on` / `sse`               | endpoint override                                 |
| `behavior`                                | `scroll`                   | scroll animation                                  |
| `clear-timeout`                           | \*                         | event action input channel for clearing timeouts  |
| `credentials`                             | `on` / `sse`               | credentials for cross-domain communication        |
| `debounce`                                | `on`                       | debounce the `on` feature                         |
| `delete`, `post`, `put`                   | `on` / `sse`               | endpoint and method override                      |
| `error`                                   | `on`                       | result action output channel                      |
| `event:<event>`                           | `on:<event>`               | block an event action output channel              |
| `h-<header>`                              | `on`                       | request header                                    |
| `if:error`, `if:loading`                  | `on`                       | state action output channel                       |
| `if:intersects`, `if:invalid`, `if:value` | \*                         | state action output channel                       |
| `if`                                      | \*                         | state action input channel                        |
| `key`                                     | \*                         | element identification for the DOM patcher        |
| `left`                                    | `scroll`                   | scroll horizontal offset                          |
| `link:<attribute>`                        | \*                         | reference action input channel                    |
| `log`                                     | \*                         | enables logging                                   |
| `measure`                                 | `ref:width` / `ref:height` | measurement method                                |
| `method`                                  | `on`                       | method override                                   |
| `on:<event>`                              | \*                         | event action output channel                       |
| `on`                                      | \*                         | event action input channel for sending requests   |
| `once`                                    | `on`                       | `on` removed after first use                      |
| `position`                                | `render`                   | render position                                   |
| `redirect`                                | `on`                       | send redirects instead of requests                |
| `ref:<attribute>`                         | \*                         | reference action output channel                   |
| `relative`                                | `scroll`                   | use relative scroll offsets                       |
| `render`                                  | \*                         | result action input channel                       |
| `reset`                                   | \*                         | event action input channel for resetting elements |
| `result`                                  | `on` / `sse`               | result action output channel                      |
| `scroll`                                  | \*                         | event action input channel for scrolling elements |
| `sse`                                     | \*                         | SSE event type                                    |
| `stream`                                  | `on`                       | enables streaming responses                       |
| `throttle`                                | `on`                       | throttle the `on` feature                         |
| `top`                                     | `scroll`                   | scroll vertical offset                            |
| `transition`                              | `render`                   | enables view transitions                          |
| `x-<attribute>`                           | `if`                       | state condition reactive switch                   |
