<script lang="ts">
	import LoginForm from '$lib/components/login-form.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	export let data: { supabase: any; session: any };
	let { supabase, session } = data;

	supabase.auth.onAuthStateChange(
		async (event: string, session: import('@supabase/supabase-js').Session | null) => {
			if (event == 'SIGNED_IN') {
				invalidateAll();
			}
			if (event == 'SIGNED_OUT') {
				await goto('/auth');
				invalidateAll();
			}
		}
	);

	const handleLoginSuccess = ({ detail }: CustomEvent<{ role: string }>) => {
	const role = detail.role;
	goto(`/`);
};

</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<LoginForm supabase={supabase} on:loginSuccess={handleLoginSuccess} />
</div>