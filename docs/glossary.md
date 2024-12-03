# Attribute Glossary

| Name                             |  Applied With     | Description                                                                                        |
| -------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| `on:<event name>`                | *                 | initiate event actions                                                                             |
| `event:<event name>`             | `on:<event name>` | cancel the event handling if the event object does not match the specified shape                   |
| `on`                             | *                 | subscribe to an action to perform a network request or a redirect                                  |
| `debounce`                       | `on`              | debounce network requests and redirects                                                            |
| `throttle`                       | `on`              | throttle network requests and redirects                                                            |
| `get`, `href`, `action` or `src` | `on`              | specify a server endpoint for a GET request                                                        |
| `post`                           | `on`              | specify a server endpoint for a POST request                                                       |
| `put`                            | `on`              | specify a server endpoint for a PUT request                                                        |
| `delete`                         | `on`              | specify a server endpoint for a DELETE request                                                     |
| `method`                         | `on`              | specify an http method, overriding any otherwise inferred                                          |
| `name` + `value`                 | `on`              | make any element serializable for the server request                                               |
| `credentials`                    | `on`              | set the `XMLHttpRequest.withCredentials` flag to `true` for this request                           |
| `h-<header name>`                | `on`              | specify any additional request headers                                                             |
| `result`                         | `on`              | initiate render actions after a successful response                                                |
| `error`                          | `on`              | initiate render actions after an unsuccessful response                                             |
| `redirect`                       | `on`              | disregard any request configuration except for the URL resolution and do a redirect instead        |
| `once`                           | `on`              | automatically remove the `on` attribute right before sending a request/redirect for the first time |
| `if:loading`                     | `on`              | initiate loading state actions right before starting a request                                     |
| `if:error`                       | `on`              | initiate error state actions after an unsuccessful server response                                 |
| `render`                         | *                 | render a server response identified by a specific render action                                    |
| `position`                       | `render`          | specify where to place the server response in relation to the current element                      |
| `if:invalid`                     | *                 | initiate invalid state actions if an elements' value becomes invalid                               |
| `if:value`                       | *                 | initiate value state actions when the elements' value is not empty                                 |
| `if:intersects`                  | *                 | initiate intersects state actions when the element intersects the viewport                         |
| `if`                             | *                 | react to a single state action                                                                     |
| `x-<attribute name>`             | `if`              | turn an "x-" attribute into an ordinary attribute when a state action activates                    |
