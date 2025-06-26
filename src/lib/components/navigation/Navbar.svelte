<script>
	let sidebarActive = false;
	let searchQuery = '';

	function toggleSidebar() {
		sidebarActive = !sidebarActive;
	}
</script>

<nav class="sticky top-0 z-50 flex h-16 items-center justify-between bg-gradient-to-r from-indigo-900 via-indigo-700 to-indigo-900 text-white px-6 shadow-xl backdrop-blur-md border-b border-indigo-800">
	<!-- Brand -->
	<a href="/" class="text-3xl font-medium font-dmserif text-white no-underline transition-colors duration-200 hover:text-background" style="font-family: 'DM Serif Display', 'serif;">
		Eventure
	</a>

	<!-- Desktop Nav -->
	<div class="hidden items-center space-x-8 md:flex">
		<!-- Search -->
	    <div class="relative my-6">
				<input
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search events..."
	      class="w-full rounded-full border border-indigo-600 bg-indigo-100 py-2 pr-10 pl-4 text-indigo-900 placeholder-indigo-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <button
				class="absolute top-2.5 right-3 text-blue-600 hover:text-indigo-900"
				aria-label="Search"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
			</button>
		</div>

		<!-- Links -->
		<div class="flex items-center space-x-6">
			<a href="/home" class="font-medium text-background transition-colors duration-200 hover:text-white">Home</a>
			<a href="/about" class="font-medium text-background transition-colors duration-200 hover:text-white">About</a>
			<a href="/contact" class="font-medium text-background transition-colors duration-200 hover:text-white">Contact</a>
			<span class="h-6 w-px bg-muted"></span>
			<a href="/login" class="font-medium text-background transition-colors duration-200 hover:text-white">Login</a>
			<a href="/signup" class="rounded-md bg-white px-4 py-2 font-medium text-indigo-600 transition-colors duration-200 hover:bg-muted hover:text-indigo-900">
				Register
			</a>
		</div>
	</div>

	<!-- Mobile Button -->
	<button
		class="cursor-pointer border-none bg-transparent text-2xl text-white md:hidden"
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
	class={`fixed top-0 right-0 z-40 w-72 bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white md:hidden  shadow-xl transition-all duration-300 ease-in-out ${
		sidebarActive ? 'translate-x-0' : 'translate-x-full'
	}`}
	style="height: calc(100vh - 4rem);"
>

		<div class="flex h-full flex-col p-6">
			<div class="flex justify-end">
			<button onclick={toggleSidebar} class="text-white hover:text-blue-300 transition-colors duration-200" aria-label="Close menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			<!-- Search -->
			<div class="relative my-6">
				<input
	      type="text"
	      bind:value={searchQuery}
	      placeholder="Search events..."
	      class="w-full rounded-full border border-indigo-600 bg-indigo-100 py-2 pr-10 pl-4 text-indigo-900 placeholder-indigo-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

        <button class="absolute top-2.5 right-3 text-blue-600 hover:text-indigo-900" aria-label="Search">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</button>
			</div>

			<!-- Links -->
			<nav class="flex-1 overflow-y-auto space-y-2">
			<a href="/home" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-white hover:bg-indigo-800 hover:text-blue-300">Home</a>
      <a href="/about" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-white hover:bg-indigo-800 hover:text-blue-300">About</a>
      <a href="/contact" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-white hover:bg-indigo-800 hover:text-blue-300">Contact</a>

				<hr class="my-4 border-muted" />

			<a href="/login" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg text-white hover:bg-indigo-800 hover:text-blue-300">Login</a>
      <a href="/signup" onclick={toggleSidebar} class="block px-4 py-3 rounded-lg bg-blue-500 text-white text-center hover:bg-blue-600">Register</a>

      </nav>
		</div>
	</div>

	{#if sidebarActive}
		<div
			class="fixed inset-0 z-30 bg-opacity-40"
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

