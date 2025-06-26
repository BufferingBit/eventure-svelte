<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { Button } from '$lib/components/ui/button'

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/oauth-callback`
      }
    })
  }
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background">
  <div class="p-6 rounded-2xl shadow-lg bg-white dark:bg-card space-y-4 text-center">
    <h1 class="text-2xl font-bold">Welcome Back</h1>
    <p class="text-muted-foreground">Sign in to continue</p>
    <Button onclick={loginWithGoogle} variant="outline" class="w-full">
      <svg
        class="w-5 h-5 mr-2"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
        fill="currentColor"
      >
        <path
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123.1 24.3 166.2 63.9l-67.6 64.6C309.2 93.3 281.1 80 248 80c-88.2 0-159.8 74.8-159.8 176S159.8 432 248 432c80.4 0 131.3-47.3 137.4-113.8H248v-91.3h240z"
        />
      </svg>
      Login with Google
    </Button>
  </div>
</div>


