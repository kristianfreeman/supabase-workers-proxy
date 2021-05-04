import { json, error, missing, ThrowableRouter, withParams } from 'itty-router-extras'
import { createClient } from '@supabase/supabase-js'

const router = ThrowableRouter()

// apiKey is the parsed JWT for a user.
// Not currently supported by Supabase's client, but eventually
// you'll be able to auth _as_ a user by providing this value.
const supabase = (apiKey?: string) =>
  createClient(SUPABASE_URL, SUPABASE_API_KEY)

const parseAuthHeader = (header: string) => {
  if (!header) return
  const [_, token] = header.split("Bearer ")
  return token
}

router.get('/users', async (
  { headers }: { headers: Headers }
) => {
  const auth = parseAuthHeader(headers.get("Authorization")!)
  const { data, error } = await supabase(auth)
    .from('user')
    .select()

  return error ? error(500, error.message) : json(data)
})

router.get('/users/:id', withParams, async (
  { headers, id }: { headers: Headers, id: string }
) => {
  const auth = parseAuthHeader(headers.get("Authorization")!)
  const { data } = await supabase(auth)
    .from('user')
    .select()
    .eq('id', id)

  const user = data && data.length ? data[0] : null
  return user ? json(user) : missing("No user found")
})

router.all('*', () => Response.redirect("https://github.com/signalnerve/supabase-workers-proxy"))

addEventListener("fetch", event => {
  event.respondWith(router.handle(event.request))
})