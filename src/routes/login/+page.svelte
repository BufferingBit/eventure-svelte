<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { Button } from '$lib/components/ui/button'
  import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
  } from '$lib/components/ui/card'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { enhance } from '$app/forms'

  let email = ''
  let password = ''
  let error: string | null = null

  function handleGoogleClick(event: Event) {
  event.preventDefault();
  loginWithGoogle();
}


  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/oauth-callback`
      }
    })
  }

  async function loginWithEmail(event: Event) {
    event.preventDefault()
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    error = err?.message || null;
     if (err) {
    error = err.message
  } else {
    // Redirect on success
    goto('/dashboard') // change this to your desired route
  }
  }
</script>


<!-- Background -->
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 font-sans relative">
  <!-- Brand mark -->
  <div class="absolute top-10 text-6xl font-extrabold text-primary/10 select-none pointer-events-none z-0">
    Eventure
  </div>

  <!-- Card -->
  <Card
    class="relative z-10 w-full max-w-md border border-muted shadow-xl bg-card backdrop-blur-md transition-transform hover:animate-card-hover rounded-2xl"
  >
    <CardHeader class="text-center space-y-2">
      <CardTitle class="text-3xl font-bold text-primary">Welcome to Eventure</CardTitle>
      <CardDescription class="text-gray-500">Sign in to continue</CardDescription>
    </CardHeader>

    <CardContent class="space-y-5">
      <form use:enhance on:submit={loginWithEmail} class="space-y-4">
        <div class="space-y-1">
          <Label for="email">Email</Label>
          <Input id="email" type="email" bind:value={email} required />
        </div>

        <div class="space-y-1">
          <Label for="password">Password</Label>
          <Input id="password" type="password" bind:value={password} required />
        </div>

        <Button type="submit" class="w-full bg-primary text-primary-foreground hover:bg-blue-700">
          Login with Email
        </Button>

        {#if error}
          <p class="text-sm text-red-500 text-center">{error}</p>
        {/if}
      </form>

      <div class="relative flex items-center justify-center">
        <span class="bg-card px-2 text-sm text-gray-400 z-10">or</span>
        <div class="absolute w-full h-px bg-muted -z-0" />
      </div>

      <Button onclick={handleGoogleClick} variant="outline" class="w-full border-muted hover:bg-blue-50 text-primary">
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor">
          <path
            d="M488 261.8C488 403.3 391.1 504 248 504..."
          />
        </svg>
        Login with Google
      </Button>
    </CardContent>
  </Card>
</div>





