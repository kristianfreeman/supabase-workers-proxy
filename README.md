# supabase-workers-proxy

This codebase is a proof-of-concept for making API requests to Supabase inside of a Cloudflare Workers serverless function.

Supabase's JavaScript client doesn't work directly in Workers without using Webpack's `externals` feature to replace `cross-fetch` with the native `fetch` API in Workers, as seen [here](linktowebpackconfig).

You can see an example of this API at `supabase-workers-proxy.signalnerve.workers.dev`:

- `supabase-workers-proxy.signalnerve.workers.dev/users`: select all users
- `supabase-workers-proxy.signalnerve.workers.dev/users/:id`: query for a user by id
- `supabase-workers-proxy.signalnerve.workers.dev/*`: all other requests are redirected to this GitHub project

This project is built on TypeScript using [`itty-router`](https://itty-router.dev).

To deploy your own version, clone or fork the project, replace the `account_id` value in `wrangler.toml` with your own, and then set two secrets using `wrangler secret put`:

- `SUPABASE_API_KEY`: anon/public key available in your Supabase project's "API settings"
- `SUPABASE_URL`: RESTful endpoint URL available in your Supabase project's "API settings"