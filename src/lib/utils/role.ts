import { supabase } from '$lib/supabaseClient';

export async function loadUserRole(): Promise<string | null> {
	const {
		data: { user }
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data, error } = await supabase
		.from('users')
		.select('role_tag')
		.eq('id', user.id)
		.single();

	if (error || !data) return null;

	return data.role_tag;
}

