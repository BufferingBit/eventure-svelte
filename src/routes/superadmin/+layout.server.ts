import { redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export async function load({ locals }) {
	const user = locals.user;

	if (!user) {
		console.log('No user found in server');
		throw redirect(303, '/?unauthorized=1');
	}

	const { data, error } = await locals.supabase
		.from('user')
		.select('role_tag')
		.eq('id', user.id)
		.single();

	console.log('User fetched:', user);
	console.log('Role data:', { data, error });

	if (error || data?.role_tag !== 'super_admin') {
		throw redirect(303, '/?unauthorized=1');
	}

	return {
		user,
		role_tag: data.role_tag
	};
}


