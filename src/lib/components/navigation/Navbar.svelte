<script>
	let sidebarActive = false;
	let searchQuery = '';

	function toggleSidebar() {
		sidebarActive = !sidebarActive;
	}
</script>

<nav class="sticky top-0 z-50 flex h-16 items-center justify-between bg-white/90 dark:bg-gray-900/95 text-gray-900 dark:text-white px-6 border-b border-gray-200 dark:border-gray-700 backdrop-blur-md">
  <!-- Brand -->
	<a href="/" class="text-2xl font-xl font-dmserif bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent no-underline" style="font-family: 'DM Serif Display', 'serif;">
		Eventure
	</a>

	<!-- Desktop Nav -->
	<div class="hidden items-center space-x-8 md:flex">
		<!-- Search -->
	    <div class="relative">
				<input
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search events..."
	      class="w-64 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
      />

      <button
				class="absolute top-2.5 right-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
				aria-label="Search"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</button>
		</div>

		<!-- Links -->
		<div class="flex items-center space-x-6">
			<a href="/home" class="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</a>
			<a href="/about" class="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
			<a href="/contact" class="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
			<span class="h-6 w-px bg-gray-300 dark:bg-gray-600"></span>
			<a href="/login" class="font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</a>
			<a href="/signup" class="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 transition-colors">
				Register
			</a>
		</div>
	</div>

	<!-- Mobile Button -->
	<button
		class="cursor-pointer border-none bg-transparent text-2xl text-gray-700 dark:text-gray-300 md:hidden hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
		onclick={toggleSidebar}
		aria-label="Toggle Menu"
	>
		{#if sidebarActive}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		{:else}
			<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
			</svg>
		{/if}
	</button>

	<!-- Mobile Sidebar -->
<div
	class={`fixed top-0 right-0 z-40 w-72 bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-white md:hidden shadow-xl transition-all duration-300 ease-in-out ${
		sidebarActive ? 'translate-x-0' : 'translate-x-full'
	}`}
	style="height: 100vh;"
>
		<div class="flex h-full flex-col p-6">
			<div class="flex justify-end">
				<button onclick={toggleSidebar} class="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label="Close menu">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Brand -->
			<a href="/" class="mb-8 text-2xl font-medium font-dmserif bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent no-underline" style="font-family: 'DM Serif Display', 'serif;">
				Eventure
			</a>

			<!-- Search -->
			<div class="relative mb-6">
				<input
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search events..."
	      class="w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-2 pr-10 pl-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
      />

        <button class="absolute top-2.5 right-3 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400" aria-label="Search">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>
			</div>

			<!-- Links -->
			<nav class="flex-1 overflow-y-auto space-y-2">
				<a href="/home" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</a>
				<a href="/about" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</a>
				<a href="/contact" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>

				<hr class="my-4 border-gray-200 dark:border-gray-700" />

				<a href="/login" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</a>
				<a href="/signup" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg bg-indigo-600 text-white text-center hover:bg-indigo-700 transition-colors">Register</a>
			</nav>
		</div>
	</div>

	{#if sidebarActive}
		<div
			class="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
			onclick={toggleSidebar}
			role="button"
			tabindex="0"
			aria-label="Close menu"
			onkeydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') toggleSidebar();
			}}
		/>
	{/if}
</nav>
