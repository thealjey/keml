<!-- prettier-ignore-start -->
!!! info "Info"
    SSE connections are inherently limited across browser tabs on the same domain.  
    KEML does everything it can to minimize them while remaining spec compliant.  
    But you are still advised to limit them as much as possible.  
    Reuse the same endpoint for SSE communication and only change the event type.
<!-- prettier-ignore-end -->

SSE, or
[Server-sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events),
is a method of sending results from the server without first being prompted by a
request. The server decides entirely on its own when and what to send.

Think of it as a lighter and simpler alternative to WebSockets that can only
send data in one direction — from server to client. And given that we have
always been able to send data from client to server using normal requests, this
already satisfies the need for full bi-directional communication.

[Polling](./event/on.md#polling) also works, but it is like spamming your server
with constant "Are we there yet?" queries. You have to balance between sending
them too often and getting a "No!" every time, or sending them too infrequently
and accepting that you might be displaying stale data sometimes.

---

- the attribute takes an event type sent by the server as a value, and if
  omitted, defaults to `message`
- endpoint resolution and override rules are the same as with
  [on](./event/on.md#endpointmethod-configuration)
- the HTTP method is always `GET` and cannot be overridden
- the `credentials` attribute behaves the same
- result actions and events behave the same, except there is no concept of an
  invalid status code

---

<div class="tabs">
  <label><input type="radio" name="tabs-1" checked>HTML</label>
  <label><input type="radio" name="tabs-1">Server</label>
  <label><input type="radio" name="tabs-1">Result</label>
  <section>
```html
--8<-- "snippets/sse-client.html"
```
  </section>
  <section>
```js
--8<-- "snippets/sse-server.html"
```
  </section>
  <section class="ma3">
--8<-- "snippets/sse-client.html"
  </section>
</div>
