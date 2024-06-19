# Special Actions

There a few action names that have a special meaning:

1. `reset` - if used on a form, will reset said form
1. `pushState` - will call the same method of the history api, changing the
   browser URI to the one provided by the `redirect` attribute, or of it is
   absent - to the same URI that a request would have been sent by this element
1. `replaceState` - will call the same method of the history api, changing the
   browser URI to the one provided by the `redirect` attribute, or of it is
   absent - to the same URI that a request would have been sent by this element
1. `follow` - following the same logic of `pushState` and `replaceState` is
   also going to perform a redirect, but without using the history api and
   instead going to trigger a full page reload

KEML makes the server aware of the AJAX nature of its requests by automatically
including a special "X-Requested-With" header in each request.

KEML makes the server aware of the browsers timezone for the server-side
date formatting by setting a "tzo" cookie to the value produced by the
[getTimezoneOffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset) function.

## Form Reset Example

- the form will be automatically reset after a submit (please do note that
  actions are initiated sequentially from left to right; so if the action list
  was in the reverse order i.e "reset handleSubmit", the form would be reset
  before submit, making it invalid because the input is required, triggering no
  actual server request)

```html
<form on:submit="handLeSubmit reset"
      on="handLeSubmit"
      method="post"
      action="/server-path"
>
  <input type="text" name="name" required>
  <button>Submit</button>
</form>
```

## Redirect Example

- redirect to "/" using the history api after a successful submission of the
  form

```html
<form on:submit="handLeSubmit"
      on:result="pushState"
      on="handLeSubmit"
      method="post"
      action="/login"
      redirect="/"
>
  <input type="text"     name="username">
  <input type="password" name="password">
  <button>Login</button>
</form>
```

- just a normal link, but supercharged by the history api

```html
<a on:click="replaceState" href="/about">About</a>
```

Both of the above examples are going to trigger a navigate event.

## Navigate Event Example

- send a GET request to "content" when a navigate event is triggered and
  replace all of the children of the div with the server response

```html
<div on:navigate="loadContent"
     on="loadContent"
     get="content"
     result="pageContent"
     render="pageContent"
></div>
```
