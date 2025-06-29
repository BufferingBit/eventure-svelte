<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';

  // Form state
  let name = '';
  let logoFile: File | null = null;
  let website = '';
  let location = '';
  let type = '';
  let affiliation = '';
  let founded = '';
  let intake = '';
  let accreditation = '';
  let streams = '';
  let description = '';

  let message: { type: 'error' | 'success'; text: string } | null = null;
  let isLoading = false;

  async function handleSubmit() {
    e.preventDefault();
    message = null;
    isLoading = true;

    if (!name || !logoFile) {
        message = { type: 'error', text: 'Name and logo are required.' };
        isLoading = false;
        return;
    }
    try {
      // 1. Create college data
      const collegeData = {
        name,
        logo_url: null, // Will be updated after upload
        official_website: website || null,
        location: location || null,
        description: {
          desc: description,
          type,
          affiliation,
          founded,
          intake,
          accreditation: accreditation.split(',').map(a => a.trim()),
          streams: streams.split(',').map(s => s.trim())
        }
      };

      // 2. Insert college record
      const { data: college, error: insertError } = await supabase
        .from('colleges')
        .insert(collegeData)
        .select()
        .single();

      if (insertError) throw insertError;

      // 3. Handle logo upload if exists
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);

        // Get session for auth token
        const { data: { session } } = await supabase.auth.getSession();

        const uploadResponse = await fetch('/api/upload/logo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Logo upload failed');
        }

        const { url: logo_url } = await uploadResponse.json();

        // Update college with logo URL
        await supabase
          .from('colleges')
          .update({ logo_url })
          .eq('id', college.id);
      }

      message = { type: 'success', text: 'College created successfully!' };
      setTimeout(() => goto('/superadmin/colleges'), 1500);
    } catch (err) {
      console.error('College creation error:', err);
      message = {
        type: 'error',
        text: err.message || 'Failed to create college'
      };
    } finally {
      isLoading = false;
    }
  }
</script>

<section class="p-6 max-w-3xl mx-auto space-y-6">
  <h1 class="text-2xl font-bold">Create New College</h1>

  {#if message}
    <div class={`p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
      {message.text}
    </div>
  {/if}

  <form onsubmit={handleSubmit} class="space-y-4">
    <!-- Basic Fields -->
    <div>
      <label class="block font-medium">Name</label>
      <input type="text" bind:value={name} class="input" required />
    </div>

    <div>
      <label class="block font-medium">Logo</label>
      <input type="file" accept="image/*" on:change={(e) => logoFile = e.target.files[0]} required />
    </div>

    <div>
      <label class="block font-medium">Official Website</label>
      <input type="url" bind:value={website} class="input" />
    </div>

    <div>
      <label class="block font-medium">Location</label>
      <input type="text" bind:value={location} class="input" />
    </div>

    <!-- Tags -->
    <hr class="my-4" />
    <h2 class="text-lg font-semibold">Tags</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label class="block font-medium">Type</label>
        <input type="text" bind:value={type} class="input" />
      </div>

      <div>
        <label class="block font-medium">Affiliation</label>
        <input type="text" bind:value={affiliation} class="input" />
      </div>

      <div>
        <label class="block font-medium">Founded</label>
        <input type="text" bind:value={founded} class="input" />
      </div>

      <div>
        <label class="block font-medium">Intake</label>
        <input type="number" bind:value={intake} class="input" />
      </div>

      <div class="sm:col-span-2">
        <label class="block font-medium">Accreditation (comma separated)</label>
        <input type="text" bind:value={accreditation} class="input" />
      </div>

      <div class="sm:col-span-2">
        <label class="block font-medium">Streams (comma separated)</label>
        <input type="text" bind:value={streams} class="input" />
      </div>

      <div class="sm:col-span-2">
        <label class="block font-medium">About / Description</label>
        <textarea bind:value={description} rows="4" class="input"></textarea>
      </div>
    </div>

    <button
      type="submit"
      class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded"
      disabled={isLoading}
    >
      {isLoading ? 'Creating...' : 'Create College'}
    </button>
  </form>
</section>

<style>
  .input {
    @apply w-full mt-1 rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500;
  }
</style>
