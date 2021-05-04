import { json, error, missing, ThrowableRouter, withParams } from 'itty-router-extras'
import { createClient } from '@supabase/supabase-js'

const router = ThrowableRouter()
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)

router.get('/users', async () => {
  const { data, error } = await supabase
    .from('user')
    .select()

  return error ? error(500, error.message) : json(data)
})

router.get('/users/:id', withParams, async ({ id }: { id: string }) => {
  const { data } = await supabase
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