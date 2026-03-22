import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { promoteToAssessoria } from '../assessoria/actions'

export const runtime = 'edge'

export default async function SetupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  try {
    // Promove o usuário atual para Assessoria (Admin)
    await promoteToAssessoria()
  } catch (error) {
    console.error("Erro no setup:", error)
  }

  // Redireciona para a home, que agora deve carregar o AssessoriaDashboard
  redirect('/')
}
