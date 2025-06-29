<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	// Form state
	let name = '';
	let logoFile: File | null = null;
	let website = '';
	let domain = '';
	let collegeId = '';
	let description = '';
	let socialMedia = {
		instagram: '',
		linkedin: '',
		twitter: '',
		facebook: ''
	};
	let tags: string[] = [];
	let newTag = '';

	let message: { type: 'error' | 'success'; text: string } | null = null;
	let isLoading = false;
	let colleges: Array<{ id: string; name: string }> = [];

	// Load colleges for dropdown
	async function loadColleges() {
		try {
			const { data, error } = await supabase
				.from('colleges')
				.select('id, name')
				.order('name', { ascending: true });

			if (error) throw error;
			colleges = data || [];
		} catch (err) {
			console.error('Error loading colleges:', err);
			message = { type: 'error', text: 'Failed to load colleges' };
		}
	}

	loadColleges();

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		logoFile = target.files?.[0] ?? null;
	}

	function addTag() {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			tags = [...tags, newTag.trim()];
			newTag = '';
		}
	}

	function removeTag(tagToRemove: string) {
		tags = tags.filter(tag => tag !== tagToRemove);
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		message = null;
		isLoading = true;

		if (!name || !logoFile || !collegeId) {
			message = { type: 'error', text: 'Name, logo, and college are required.' };
			isLoading = false;
			return;
		}

		try {
			// 1. Upload logo
			const formData = new FormData();
			formData.append('file', logoFile);

			const uploadResponse = await fetch('/api/upload/logo', {
				method: 'POST',
				body: formData
			});

			if (!uploadResponse.ok) {
				const errorData = await uploadResponse.json();
				throw new Error(errorData.error || 'Logo upload failed');
			}

			const { url: logo_url } = await uploadResponse.json();

			// 2. Prepare description JSON object
			const descData: Record<string, any> = {};

			// Add the main description if provided
			if (description) descData.desc = description;

			// Add social media links
			descData.social_media = {};
			if (socialMedia.instagram) descData.social_media.instagram = socialMedia.instagram;
			if (socialMedia.linkedin) descData.social_media.linkedin = socialMedia.linkedin;
			if (socialMedia.twitter) descData.social_media.twitter = socialMedia.twitter;
			if (socialMedia.facebook) descData.social_media.facebook = socialMedia.facebook;

			// Add tags if any
			if (tags.length > 0) descData.tags = tags;

			// 3. Insert club data
			const { data, error } = await supabase
				.from('clubs')
				.insert({
					name,
					logo_url,
					official_website: website || null,
					college_id: collegeId,
					domain: domain || null,
					desc: descData
				})
				.select();

			if (error) {
				console.error('Supabase error:', error);
				throw new Error(error.message);
			}

			if (!data) {
				throw new Error('No data returned from insert');
			}

			message = { type: 'success', text: 'Club created successfully!' };
			setTimeout(() => goto('/superadmin/clubs'), 1500);
		} catch (err) {
			console.error('Club creation error:', err);
			message = { type: 'error', text: err.message || 'Failed to create club' };
		} finally {
			isLoading = false;
		}
	}
</script>

<section class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-800">Create New Club</h1>
		<p class="text-gray-600 mt-2">Fill in the details below to add a new club to the system.</p>
	</div>

	{#if message}
		<div class={`p-4 mb-6 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
			{message.text}
		</div>
	{/if}

	<form on:submit={handleSubmit} class="space-y-6">
		<!-- Basic Information Section -->
		<div class="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">Basic Information</h2>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Club Name <span class="text-red-500">*</span></label>
				<input
					type="text"
					bind:value={name}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="Enter club name"
					required
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">College <span class="text-red-500">*</span></label>
				<select
					bind:value={collegeId}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					required
				>
					<option value="">Select a college</option>
					{#each colleges as college}
						<option value={college.id}>{college.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Logo <span class="text-red-500">*</span></label>
				<div class="mt-1 flex items-center">
					<label for="logo-upload" class="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
						Choose File
					</label>
					<input
						id="logo-upload"
						type="file"
						accept="image/*"
						on:change={handleFileChange}
						class="sr-only"
						required
					/>
					<span class="ml-3 text-sm text-gray-500">{logoFile ? logoFile.name : 'No file chosen'}</span>
				</div>
				<p class="mt-1 text-xs text-gray-500">Recommended size: 300x300 pixels, PNG format</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
					<input
						type="url"
						bind:value={website}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="https://example.com"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Domain/Focus Area</label>
					<input
						type="text"
						bind:value={domain}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="e.g., Development, Arts, Sports"
					/>
				</div>
			</div>
		</div>

		<!-- Description Section -->
		<div class="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">About the Club</h2>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
				<textarea
					bind:value={description}
					rows="6"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="Provide a detailed description about the club..."
				></textarea>
			</div>
		</div>

		<!-- Tags Section -->
		<div class="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">Tags & Categories</h2>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Add Tags</label>
				<div class="flex gap-2">
					<input
						type="text"
						bind:value={newTag}
						class="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="e.g., Programming, Robotics"
						on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
					/>
					<button
						type="button"
						on:click={addTag}
						class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
					>
						Add
					</button>
				</div>
				<p class="mt-1 text-xs text-gray-500">Press Enter or click Add to include tags</p>

				{#if tags.length > 0}
					<div class="mt-3 flex flex-wrap gap-2">
						{#each tags as tag}
							<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
								{tag}
								<button
									type="button"
									on:click={() => removeTag(tag)}
									class="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900 focus:outline-none"
								>
									&times;
								</button>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Social Media Section -->
		<div class="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">Social Media Links</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
					<div class="flex rounded-md shadow-sm">
						<span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							@
						</span>
						<input
							type="text"
							bind:value={socialMedia.instagram}
							class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="username"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
					<div class="flex rounded-md shadow-sm">
						<span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							linkedin.com/in/
						</span>
						<input
							type="text"
							bind:value={socialMedia.linkedin}
							class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="profile-id"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Twitter/X</label>
					<div class="flex rounded-md shadow-sm">
						<span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							@
						</span>
						<input
							type="text"
							bind:value={socialMedia.twitter}
							class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="username"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
					<div class="flex rounded-md shadow-sm">
						<span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
							facebook.com/
						</span>
						<input
							type="text"
							bind:value={socialMedia.facebook}
							class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
							placeholder="page-name"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button
				type="button"
				on:click={() => goto('/superadmin/clubs')}
				class="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				disabled={isLoading}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
				disabled={isLoading}
			>
				{#if isLoading}
					<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					Creating...
				{:else}
					Create Club
				{/if}
			</button>
		</div>
	</form>
</section>

<style>
	/* Add smooth transitions for better UX */
	.input, select, textarea {
		transition: all 0.2s ease;
	}

	/* Improve focus states */
	.input:focus, select:focus, textarea:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
	}
</style>
