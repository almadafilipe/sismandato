import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MunicipiosManagement from '@/components/assessoria/MunicipiosManagement'
import MainLayout from '@/components/layout/MainLayout'
import { getMunicipios } from '@/lib/supabase/api'

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function AssessoriaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [
    perfilRes,
    municipiosRes
  ] = await Promise.all([
    supabase.from('perfis').select('id, role, nome').eq('id', user.id).single(),
    getMunicipios()
  ])

  if (perfilRes.data?.role !== 'assessoria') redirect('/')

  return (
    <MainLayout
      role={perfilRes.data?.role}
      userName={perfilRes.data?.nome}
      activePath="/assessoria"
    >
      <MunicipiosManagement municipios={municipiosRes.data || []} />
    </MainLayout>
  )
}
