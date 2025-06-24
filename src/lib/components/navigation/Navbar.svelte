<script>
	let sidebarActive = false;
	let searchQuery = '';

	function toggleSidebar() {
		sidebarActive = !sidebarActive;
	}
</script>

<nav
	class="sticky top-0 z-30 flex h-16 items-center justify-between bg-indigo-900 p-4 text-white shadow-lg"
>
	<!-- Brand Logo -->
	<a
		href="/"
		class="text-2xl font-bold text-white no-underline transition-colors duration-200 hover:text-indigo-200"
	>
		Eventure
	</a>

	<!-- Desktop Navigation -->
	<div class="hidden items-center space-x-8 md:flex">
		<!-- Search Bar -->
		<div class="relative">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search events..."
				class="w-64 rounded-full bg-indigo-800 py-2 pr-10 pl-4 text-white placeholder-indigo-300 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
			/>
			<button
				class="absolute top-2.5 right-3 text-indigo-300 transition-colors duration-200 hover:text-white"
				aria-label="Search"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</button>
		</div>

		<!-- Navigation Links -->
		<div class="flex items-center space-x-6">
			<div class="flex justify-around space-x-6">
				<a
					href="/home"
					class="font-medium text-white no-underline transition-colors duration-200 hover:text-indigo-200"
					>Home</a
				>
				<a
					href="/about"
					class="font-medium text-white no-underline transition-colors duration-200 hover:text-indigo-200"
					>About</a
				>
				<a
					href="/contact"
					class="font-medium text-white no-underline transition-colors duration-200 hover:text-indigo-200"
					>Contact</a
				>
			</div>
			<span class="h-6 w-px bg-indigo-500"></span>
			<div class="flex justify-around space-x-6">
				<a
					href="/login"
					class="font-medium text-white p-4 no-underline transition-colors duration-200 hover:text-indigo-200"
					>Login</a
				>
				<a
					href="/register"
					class="rounded-md bg-indigo-600 h-10 mt-2 px-4 py-2 font-medium text-white no-underline transition-colors duration-200 hover:bg-indigo-500"
					>Register</a
				>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Button -->
	<button
		class="cursor-pointer border-none bg-transparent text-2xl text-white transition-transform duration-200 hover:scale-110 focus:outline-none md:hidden"
		on:click={toggleSidebar}
		aria-label="Toggle Menu"
		aria-expanded={sidebarActive}
	>
		{#if sidebarActive}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M6 18L18 6M6 6l12 12"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-8 w-8"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		{/if}
	</button>

	<!-- Mobile Sidebar -->
	<div
		class={`fixed top-0 right-0 z-40 w-72 bg-white shadow-xl transition-all duration-300 ease-in-out ${sidebarActive ? 'translate-x-0' : 'translate-x-full'}`}
		style="height: calc(100vh - 4rem);"
	>
		<div class="flex h-full flex-col p-6">
			<!-- Close Button -->
			<div class="flex justify-end">
				<button
					on:click={toggleSidebar}
					class="text-gray-600 transition-colors duration-200 hover:text-gray-900"
					aria-label="Close menu"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile Search -->
			<div class="relative my-6">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search events..."
					class="w-full rounded-full border border-gray-300 py-2 pr-10 pl-4 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
				/>
				<button
					class="absolute top-2.5 right-3 text-gray-400 transition-colors duration-200 hover:text-indigo-600"
					aria-label="Search"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</button>
			</div>

			<!-- Mobile Navigation Links -->
			<nav class="flex-1 overflow-y-auto">
				<div class="space-y-2">
					<a
						href="/home"
						class="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700"
						on:click={toggleSidebar}>Home</a
					>
					<a
						href="/about"
						class="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700"
						on:click={toggleSidebar}>About</a
					>
					<a
						href="/contact"
						class="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700"
						on:click={toggleSidebar}>Contact</a
					>
				</div>

				<hr class="my-4 border-gray-200" />

				<div class="space-y-2">
					<a
						href="/login"
						class="block rounded-lg px-4 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-indigo-50 hover:text-indigo-700"
						on:click={toggleSidebar}>Login</a
					>
					<a
						href="/register"
						class="block rounded-lg bg-indigo-600 px-4 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-indigo-700"
						on:click={toggleSidebar}>Register</a
					>
				</div>
			</nav>
		</div>
	</div>

	<!-- Overlay -->
	{#if sidebarActive}
		<div
			class="bg-opacity-50 fixed inset-0 z-30 bg-black transition-opacity duration-300"
			on:click={toggleSidebar}
			role="button"
			tabindex="0"
			aria-label="Close menu"
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') toggleSidebar();
			}}
		></div>
	{/if}
</nav>
