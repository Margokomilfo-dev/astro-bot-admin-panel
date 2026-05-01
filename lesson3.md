# Lesson 3: Authorization

## What we added

We created a `/login` page with a login form:

- email/login input
- password input
- submit button
- error message under the button

The form calls a Server Action instead of handling authorization in the browser.

## Server Action

The authorization logic lives in:

```text
app/login/actions.ts
```

The action receives `FormData`, reads the email and password, and calls Supabase Auth:

```ts
supabase.auth.signInWithPassword({
  email,
  password,
});
```

If authorization fails, the action returns an error state:

```ts
{
  error: "Неверный логин или пароль."
}
```

If authorization succeeds, the user is redirected to:

```text
/messages
```

## Client Form State

The form UI lives in:

```text
app/login/login-form.tsx
```

It uses React `useActionState` to call the Server Action and show the returned error under the submit button.

We do not show the user email after successful login anymore. A successful login redirects to the messages page.

## Supabase Clients

We separated Supabase clients by responsibility:

```text
lib/supabase/server.ts
```

### Auth client

```ts
createSupabaseServerClient()
```

This client is cookie-aware. It is used for authorization because Supabase Auth needs cookies to store and read the user session.

### Admin client

```ts
createSupabaseAdminClient()
```

This client uses `SB_SECRET` without cookies. It is used for server-side admin data reads, such as loading messages.

## Why we separated them

The login flow must know about the user session, so it uses the cookie-aware client.

The messages page should read admin data from the server and should not depend on the logged-in user's cookies. If it used the auth client, Supabase RLS could filter rows based on the current user and the messages page could appear empty.

That is why `/messages` now uses the admin client, while `/login` uses the auth client.
