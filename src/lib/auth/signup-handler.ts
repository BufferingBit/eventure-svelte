import { supabase } from '$lib/supabaseClient'

export async function handleNewUser(user: { id: string; email: string; user_metadata?: any }) {
  const { id, email, user_metadata } = user

  await supabase.from('user').insert({
    id,
    email,
    name: user_metadata?.full_name || 'New User',
    roll_no: '',
    graduation_year: new Date().getFullYear() + 4,
    contact_no: null,
    course: null,
    branch: null,
    college_id: null,
  })
}


