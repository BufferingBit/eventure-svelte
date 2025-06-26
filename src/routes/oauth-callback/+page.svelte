<script lang="ts">
  import { onMount } from 'svelte'
  import { supabase } from '$lib/supabaseClient'
  import { goto } from '$app/navigation'
  import { handleNewUser } from '$lib/auth/signup-handler'

  onMount(async () => {
    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (session?.user) {
      const uid = session.user.id

      // Check if this user exists in `public.user`
      const { data, error } = await supabase
        .from('user')
        .select('id')
        .eq('id', uid)
        .single()

      // If not, create it and redirect to profile completion
      if (error || !data) {
        if (!session.user.email) {
          throw new Error('User email is missing')
        }
        await handleNewUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        })
        goto('/complete-profile')
      } else {
        goto('/dashboard')
      }
    }
  })
</script>

<p>Redirecting...</p>


