<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  let name = ''
  let roll_no = ''
  let graduation_year = new Date().getFullYear() + 4
  let course = ''
  let branch = ''
  let college_id = ''
  let colleges = []
  let loading = false
  let error = null

  onMount(async () => {
    // Check if profile already complete
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      goto('/signup')
      return
    }

    // Fetch colleges for dropdown
     const { data: collegesData, error: collegesError } = await supabase
      .from('colleges')
      .select('id, name')
      .order('name', { ascending: true })

    if (collegesError) {
      console.error('Error fetching colleges:', collegesError)
    } else {
      colleges = collegesData || []
      console.log('Colleges fetched:', colleges) // Debug log
    }
    // Check existing profile
    const { data: profile } = await supabase
      .from('user')
      .select('name, roll_no, graduation_year, college_id')
      .eq('id', user.id)
      .single()

    if (profile?.name && profile?.roll_no && profile?.graduation_year && profile?.college_id) {
      goto('/')
    } else if (profile) {
      // Pre-fill existing data
      name = profile.name || ''
      roll_no = profile.roll_no || ''
      graduation_year = profile.graduation_year || new Date().getFullYear() + 4
      college_id = profile.college_id || ''
    }
  })

  async function updateProfile() {
    loading = true
    error = null

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      goto('/signup')
      return
    }

    // Validate required fields
    if (!name || !roll_no || !college_id) {
      error = 'Name, Roll No, and College are required'
      loading = false
      return
    }

    const { error: dbError } = await supabase.from('user').upsert({
      id: user.id,
      email: user.email,
      name,
      roll_no,
      graduation_year,
      course,
      branch,
      college_id,
      updated_at: new Date().toISOString()
    })

    if (dbError) {
      error = dbError.message
    } else {
      goto('/dashboard')
    }

    loading = false
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 font-sans relative">
  <div class="relative z-10 w-full max-w-md p-8 border border-muted shadow-xl bg-white/80 backdrop-blur-md rounded-2xl">
    <h1 class="text-3xl font-bold text-primary mb-2 text-center">Complete Your Profile</h1>
    <p class="text-gray-500 text-center mb-6">We need a few more details to get started</p>

    {#if error}
      <div class="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={updateProfile} class="space-y-4">
      <!-- Required Fields -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Full Name*</label>
        <input
          bind:value={name}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Roll No*</label>
        <input
          bind:value={roll_no}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">College*</label>
        <select
          bind:value={college_id}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select your college</option>
          {#each colleges as college}
            <option value={college.id}>{college.name}</option>
          {/each}
        </select>
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Graduation Year*</label>
        <input
          bind:value={graduation_year}
          type="number"
          min={new Date().getFullYear()}
          max={new Date().getFullYear() + 10}
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Optional Fields -->
      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Course</label>
        <input
          bind:value={course}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700">Branch</label>
        <input
          bind:value={branch}
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : 'Continue'}
      </button>
    </form>
  </div>
</div>
