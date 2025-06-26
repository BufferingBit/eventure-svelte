<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { goto } from '$app/navigation'

  let name = ''
  let roll_no = ''
  let graduation_year = new Date().getFullYear() + 4
  let course = ''
  let branch = ''

  async function updateProfile() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('user').update({
      name,
      roll_no,
      graduation_year,
      course,
      branch
    }).eq('id', user.id)

    if (!error) {
      goto('/dashboard')
    }
  }
</script>

<form on:submit|preventDefault={updateProfile} class="space-y-4">
  <input bind:value={name} placeholder="Full Name" class="input" />
  <input bind:value={roll_no} placeholder="Roll No" class="input" />
  <input bind:value={graduation_year} type="number" class="input" />
  <input bind:value={course} placeholder="Course" class="input" />
  <input bind:value={branch} placeholder="Branch" class="input" />
  <button class="btn btn-primary" type="submit">Continue</button>
</form>


