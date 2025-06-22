<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

	export let supabase;

	let email = '';
	let password = '';
	let session: import('@supabase/supabase-js').Session | null = null;
	let isSignup = false;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		const { data } = await supabase.auth.getSession();
		session = data.session;
	});

	const handleLogin = async () => {
		const { error, data } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			alert(error.message);
		} else {
			session = data.session;
			dispatch('loginSuccess');
		}
	};

	const handleSignup = async () => {
		const { error, data } = await supabase.auth.signUp({ email, password });

		if (error) {
			alert(error.message);
		} else {
			alert('Account created! Please check your email for confirmation.');
			isSignup = false; // Switch to login mode
		}
	};

	const handleSubmit = async () => {
		if (isSignup) {
			await handleSignup();
		} else {
			await handleLogin();
		}
	};

	const handleLogout = async () => {
		await supabase.auth.signOut();
		session = null;
		dispatch('logout');
	};
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">
			{#if session}
				Welcome!
			{:else}
				{isSignup ? 'Sign Up' : 'Login'}
			{/if}
		</Card.Title>
		<Card.Description>
			{#if session}
				You are logged in. Click below to logout.
			{:else}
				{isSignup ? 'Create a new account.' : 'Enter your credentials to log in.'}
			{/if}
		</Card.Description>
	</Card.Header>

	<Card.Content>
		{#if session}
			<Button onclick={handleLogout} class="w-full bg-red-600 hover:bg-red-700">Logout</Button>
		{:else}
			<form on:submit|preventDefault={handleSubmit} class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} required placeholder="m@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" bind:value={password} required />
				</div>
				<Button type="submit" class="w-full">
					{isSignup ? 'Sign Up' : 'Login'}
				</Button>
			</form>
			<div class="mt-4 text-center text-sm">
				{#if isSignup}
					Already have an account? 
					<a href="/#" class="text-blue-600 underline" on:click|preventDefault={() => (isSignup = false)}>Login</a>
				{:else}
					Don't have an account? 
					<a href="/#" class="text-blue-600 underline" on:click|preventDefault={() => (isSignup = true)}>Sign Up</a>
				{/if}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
