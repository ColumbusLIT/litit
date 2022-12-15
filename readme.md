# Lit IT

This app uses a Netlify identity user to sign up, log in, and securely read and write data scoped to their user in a private Sanity datastore. 

## Outline of how it works

### Signing Up 

1. Front End User signs up with [Netlify identity widget](https://github.com/netlify/netlify-identity-widget) and confirms their email
2. Front end user gets a token, and at the same time netlify sends the new user's id to Sanity.  Sanity creates a document mapped to the Netlify user by id. 

### Reading and Writing User-Scoped Data

1. Front End requests the users stuff, presenting token to netlify function
2. Netlify (with Sanity key in server-side ENV var) uses user info in token and queries Sanity for the user's data
3. Sanity sends the user's stuff  back to a serverless function
4. The serverless function returns it to the browser

### Some Details

This is for demonstration purposes, so it has some slow, but simple-on-the-brain patterns like:

- No frontend framework nor front-end compilation steps
- Standard browser `fetch()` calls that only result in UI updates when the new data is really back from Sanity. 
- The npm stuff you see in the top-level directory is there for Netlify functions to access when this is deployed

## Where's the Sanity part? 

You find schemas for Sanity studio [here](https://github.com/mandymozart/litit/tree/master/sanity).
