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

	async function handleSubmit(e: Event) {
		e.preventDefault();
		message = null;
		isLoading = true;

		if (!name || !logoFile) {
			message = { type: 'error', text: 'Name and logo are required.' };
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

			// Add all other metadata
			if (type) descData.type = type;
			if (affiliation) descData.affiliation = affiliation;
			if (founded) descData.founded = founded;
			if (intake) descData.intake = intake;
			if (accreditation) descData.accreditation = accreditation.split(',').map(a => a.trim());
			if (streams) descData.streams = streams.split(',').map(s => s.trim());

			// 3. Insert college data
			const { data, error } = await supabase
				.from('colleges')
				.insert({
					name,
					logo_url,
					official_website: website || null,
					location: location || null,
					description: descData
				})
				.select();

			if (error) {
				console.error('Supabase error:', error);
				throw new Error(error.message);
			}

			if (!data) {
				throw new Error('No data returned from insert');
			}

			message = { type: 'success', text: 'College created successfully!' };
			setTimeout(() => goto('/superadmin/college'), 1500);
		} catch (err) {
			console.error('College creation error:', err);
			message = { type: 'error', text: err.message || 'Failed to create college' };
		} finally {
			isLoading = false;
		}
	}

	function handleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		logoFile = target.files?.[0] ?? null;
	}
</script>

<section class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-800">Create New College</h1>
		<p class="text-gray-600 mt-2">Fill in the details below to add a new college to the system.</p>
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
				<label class="block text-sm font-medium text-gray-700 mb-1">College Name <span class="text-red-500">*</span></label>
				<input
					type="text"
					bind:value={name}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="Enter college name"
					required
				/>
				<p class="mt-1 text-xs text-gray-500">The official name of the college</p>
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
					<label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
					<input
						type="text"
						bind:value={location}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="City, State"
					/>
				</div>
			</div>
		</div>

		<!-- College Details Section -->
		<div class="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">College Details</h2>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
					<select
						bind:value={type}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					>
						<option value="">Select type</option>
						<option value="Public">Public</option>
						<option value="Private">Private</option>
						<option value="Government">Government</option>
						<option value="Autonomous">Autonomous</option>
						<option value="Deemed University">Deemed University</option>
					</select>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
					<input
						type="text"
						bind:value={affiliation}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="e.g., UGC, AICTE"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
					<input
						type="number"
						bind:value={founded}
						min="1800"
						max={new Date().getFullYear()}
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="e.g., 1950"
					/>
				</div>

				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Annual Intake</label>
					<input
						type="number"
						bind:value={intake}
						min="1"
						class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
						placeholder="Number of students"
					/>
				</div>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
				<input
					type="text"
					bind:value={accreditation}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="NAAC A++, NBA, etc. (comma separated)"
				/>
				<p class="mt-1 text-xs text-gray-500">Separate multiple accreditations with commas</p>
			</div>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Available Streams</label>
				<input
					type="text"
					bind:value={streams}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="Engineering, Medicine, Arts, etc. (comma separated)"
				/>
				<p class="mt-1 text-xs text-gray-500">Separate multiple streams with commas</p>
			</div>
		</div>

		<!-- Description Section -->
		<div class="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
			<h2 class="text-xl font-semibold text-gray-800">About the College</h2>

			<div>
				<label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
				<textarea
					bind:value={description}
					rows="6"
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
					placeholder="Provide a detailed description about the college..."
				></textarea>
				<p class="mt-1 text-xs text-gray-500">This will be displayed on the college's profile page</p>
			</div>
		</div>

		<div class="flex justify-end space-x-3 pt-4">
			<button
				type="button"
				on:click={() => goto('/superadmin/college')}
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
					Create College
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
