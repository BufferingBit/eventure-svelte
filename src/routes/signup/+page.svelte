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
  import { goto } from '$app/navigation'
  import { invalidateAll } from "$app/navigation";

  let email = ''
  let password = ''
  let error: string | null = null
  let loading = false

  async function handleSignup(event: Event) {
    event.preventDefault()
    loading = true
    error = null

    const { error: err, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/oauth-callback`
      }
    })

    // Check if profile is complete (name, roll_no, graduation_year)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('user')
        .select('name, roll_no, graduation_year, college_id')
        .eq('id', user.id)
        .single()

      if (profile?.name && profile?.roll_no && profile?.graduation_year && profile?.college_id) {
        goto('/') // Profile complete
      } else {
        goto('/complete-profile')
      }
    }

    loading = false
  }
  function handleGoogleClick(event: Event) {
    event.preventDefault()
    signUpWithGoogle()
  }

  async function signUpWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/oauth-callback`
      }
    })
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
		if(event == 'SIGNED_IN'){
			invalidateAll();
		}
		if(event == "SIGNED_OUT"){
			await goto("/login-01");
			invalidateAll();
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 font-sans relative">
  <Card class="relative z-10 w-full max-w-md border border-muted shadow-xl bg-card backdrop-blur-md hover:animate-card-hover rounded-2xl">
    <CardHeader class="text-center space-y-2">
      <CardTitle class="text-3xl font-bold text-primary">Create Your Account</CardTitle>
      <CardDescription class="text-gray-500">Sign up to get started</CardDescription>
    </CardHeader>

    <CardContent class="space-y-5">
      <form on:submit={handleSignup} class="space-y-4">
        <div class="space-y-1">
          <Label for="email">Email</Label>
          <Input id="email" type="email" bind:value={email} required />
        </div>

        <div class="space-y-1">
          <Label for="password">Password</Label>
          <Input id="password" type="password" bind:value={password} required />
        </div>

        <Button
          type="submit"
          class="w-full bg-primary text-primary-foreground hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up with Email'}
        </Button>

        {#if error}
          <p class="text-sm text-red-500 text-center">{error}</p>
        {/if}
      </form>

      <div class="relative flex items-center justify-center">
        <span class="bg-card px-2 text-sm text-gray-400 z-10">or</span>
        <div class="absolute w-full h-px bg-muted -z-0" />
      </div>

      <Button onclick={handleGoogleClick} variant="outline" class="w-full border-muted hover:bg-indigo-600 text-primary">
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" fill="currentColor">
          <path d="M488 261.8C488 403.3 391.1 504 248 504..." />
        </svg>
        Sign Up with Google
      </Button>

      <p class="text-sm text-muted-foreground text-center">
        Already have an account?
        <a href="/login" class="text-primary hover:underline">Log in</a>
      </p>
    </CardContent>
  </Card>
</div>

