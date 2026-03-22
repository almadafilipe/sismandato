import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge'
export const dynamic = 'force-dynamic'
import DeputadoDashboard from "@/components/dashboards/DeputadoDashboard";
import LiderancaDashboard from '@/components/dashboards/LiderancaDashboard';
import AssessoriaDashboard from '@/components/dashboards/AssessoriaDashboard';
import MainLayout from '@/components/layout/MainLayout';

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch o perfil do usuário da nossa tabela `perfis`
  const { data: perfil, error: perfilError } = await supabase
    .from('perfis')
    .select('id, role, nome, municipio_id')
    .eq('id', user.id)
    .single()

  if (perfilError || !perfil) {
    // Se não encontrar o perfil, pode ser que o trigger ainda não rodou.
    // Damos logout para uma nova tentativa de login.
    console.error("Perfil não encontrado, fazendo logout.", perfilError);
    redirect('/logout')
  }

  const renderDashboard = () => {
    switch (perfil.role) {
      case 'deputado':
        return <DeputadoDashboard searchParams={searchParams as Promise<{ ver_municipio?: string }>} />;
      case 'lideranca':
        return <LiderancaDashboard user={user} perfil={perfil} />;
      case 'assessoria':
        return <AssessoriaDashboard user={user} />;
      default:
        redirect('/login?message=Perfil de usuário desconhecido.');
    }
  }

  return (
    <MainLayout
      role={perfil.role}
      userName={perfil.nome}
      activePath="/"
    >
      {renderDashboard()}
    </MainLayout>
  )
}
