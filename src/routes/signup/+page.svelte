<script lang="ts">
  import { supabase } from '$lib/supabaseClient'

  let email = ''
  let password = ''

  async function handleSignup() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/oauth-callback`
      }
    })
    if (error) alert(error.message)
  }
</script>

<form on:submit|preventDefault={handleSignup} class="space-y-4">
  <input type="email" bind:value={email} placeholder="Email" class="input" />
  <input type="password" bind:value={password} placeholder="Password" class="input" />
  <button type="submit" class="btn btn-primary">Sign Up</button>
</form>


