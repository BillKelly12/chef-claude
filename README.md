# Chef Claude

Suggests a recipe from a list of ingredients.  
Frontend: React + Vite.  
Backend: Netlify Function calling Hugging Face Inference API (keeps the token secret and avoids CORS).

## How it works
- The UI POSTs to `/.netlify/functions/get-recipe`.
- The Netlify Function calls `mistralai/Mixtral-8x7B-Instruct-v0.1` via `@huggingface/inference`.
- Returns a markdown recipe shown in the app.

## Environment
Set on Netlify → Site settings → Environment variables:
- `HF_ACCESS_TOKEN` — your Hugging Face token

## Deployment
Connected to Netlify. Every push to `main` builds and deploys.  
SPA routing is handled via `netlify.toml`.

## Scripts
- `npm install`
- `npm run build`

## API (frontend usage)
```js
await fetch('/.netlify/functions/get-recipe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ingredients: ['tomato', 'onion', 'eggs', 'pasta'] })
});
