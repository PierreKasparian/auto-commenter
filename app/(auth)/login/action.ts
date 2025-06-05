'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { getStatusRedirect } from '@/utils/helpers'

export async function login(email:string,password:string) {
  const supabase = await createClient()

  const data = {
    email: email,
    password: password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return {error : error.message}
  }
  revalidatePath('/', 'layout')
  redirect(getStatusRedirect("/dashboard","Success ! 🎉","You have been logged in"))
}

export async function signup(email:string,password:string,timezone:string) {
  const supabase = await createClient()

  const data = {
    email: email,
    password: password,
  }

const { data:user, error } = await supabase.auth.signUp(data)

if (error ) {
  console.log(error)
  return {error:error.message}
}
if (!user) {
  return {error:"No user"}
}
const { error: profileError } = await supabase.from('user_timezone').insert({
  user_id: user.user!.id,
  timezone: timezone
})

if (profileError) {
  console.log(profileError.message)
  return {error:"Essayez un autre compte. "+profileError.message}
}



  revalidatePath('/', 'layout')
  redirect(getStatusRedirect("/login/confirm","Success ! 🎉","You have signed up"))
}