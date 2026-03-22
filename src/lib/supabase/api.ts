import { createClient } from "./server";

/**
 * Fetches all municipalities from the database.
 * This is a server-side function.
 */
export async function getMunicipios() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('municipios')
    .select('*, contatos!left(count), emendas!left(count)')
    .eq('contatos.status', 'aprovado') // Filtra contatos aprovados na contagem
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar municípios:", error);
    return { data: null, error };
  }
  return { data, error: null };
}

/**
 * Fetches a single municipality by its ID.
 */
export async function getMunicipioById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('municipios')
    .select('nome') // Apenas o nome é necessário aqui
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erro ao buscar município com ID ${id}:`, error);
  }
  return { data, error };
}

/**
 * Generic function to fetch data from a table based on a municipio_id.
 * @param tableName The name of the table to fetch from.
 * @param municipioId The ID of the municipality.
 * @param ordering Optional column to order by.
 */
async function fetchFromTable(tableName: string, municipioId: string, ordering?: { column: string, options?: { ascending: boolean } }) {
  const supabase = await createClient();
  let query = supabase.from(tableName).select('*').eq('municipio_id', municipioId);

  if (ordering) {
    query = query.order(ordering.column, ordering.options);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Erro ao buscar ${tableName} para o município ${municipioId}:`, error);
  }
  return { data, error };
}

// Funções específicas para cada tabela
export const getContatosByMunicipio = (id: string) => fetchFromTable('contatos', id, { column: 'created_at', options: { ascending: false } });
export const getPoliticosByMunicipio = (id: string) => fetchFromTable('politicos', id, { column: 'nome' });
export const getEmendasByMunicipio = (id: string) => fetchFromTable('emendas', id, { column: 'ano', options: { ascending: false } });
export const getObrasByMunicipio = (id: string) => fetchFromTable('obras', id, { column: 'titulo' });
export const getEventosByMunicipio = (id: string) => fetchFromTable('eventos', id, { column: 'data_hora', options: { ascending: false } });
export const getNotasByMunicipio = (id:string) => fetchFromTable('notas', id, { column: 'created_at', options: { ascending: false } });
export const getPendenciasByMunicipio = (id: string) => fetchFromTable('pendencias', id, { column: 'prioridade' });
export const getMidiasByMunicipio = (id: string) => fetchFromTable('midias', id, { column: 'created_at', options: { ascending: false } });

/**
 * Fetches all necessary data for the Lideranca Dashboard.
 */
export async function getLiderancaDashboardData(userId: string, municipioId: string) {
  const supabase = await createClient();

  const [
    municipioRes,
    aprovadosRes,
    pendentesRes,
    recentesRes
  ] = await Promise.all([
    getMunicipioById(municipioId),
    supabase.from('contatos').select('*', { count: 'exact', head: true }).eq('enviado_por', userId).eq('status', 'aprovado'),
    supabase.from('contatos').select('*', { count: 'exact', head: true }).eq('enviado_por', userId).eq('status', 'pendente'),
    supabase.from('contatos').select('id, nome, status, created_at').eq('enviado_por', userId).order('created_at', { ascending: false }).limit(5)
  ]);

  return {
    data: {
      municipioNome: municipioRes.data?.nome,
      aprovadosCount: aprovadosRes.count,
      pendentesCount: pendentesRes.count,
      recentes: recentesRes.data,
    },
    error: municipioRes.error || aprovadosRes.error || pendentesRes.error || recentesRes.error
  }
}

/**
 * Fetches aggregate stats for the Admin Dashboard.
 */
export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [
    municipiosCount,
    contatosCount,
    emendasCount,
    pendenciasCount,
  ] = await Promise.all([
    supabase.from('municipios').select('*', { count: 'exact', head: true }),
    supabase.from('contatos').select('*', { count: 'exact', head: true }).eq('status', 'aprovado'),
    supabase.from('emendas').select('*', { count: 'exact', head: true }),
    supabase.from('pendencias').select('*', { count: 'exact', head: true }).eq('status', 'aberta'),
  ]);

  return {
    data: {
      municipios: municipiosCount.count,
      contatos: contatosCount.count,
      emendas: emendasCount.count,
      pendencias: pendenciasCount.count,
    },
    error: municipiosCount.error || contatosCount.error || emendasCount.error || pendenciasCount.error,
  }
}

/**
 * Busca perfis de usuários com status pendente.
 */
export async function getPerfisPendentes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('perfis')
    .select('*')
    .eq('status', 'pendente');

  if (error) {
    console.error("Erro ao buscar perfis pendentes:", error);
  }
  return { data, error };
}

/**
 * Fetches all contacts with 'pendente' status for the approval queue.
 * Joins with perfis and municipios to get sender and city names.
 */
export async function getContatosPendentes() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contatos')
    .select(`
      id,
      nome,
      telefone,
      email,
      created_at,
      municipios ( nome ),
      perfis ( nome )
    `)
    .eq('status', 'pendente')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Erro ao buscar contatos pendentes:", error);
  }

  return { data, error };
}

/**
 * Fetches all user profiles for the Admin Dashboard.
 */
export async function getPerfis() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('perfis')
    .select(`
      id,
      nome,
      role,
      municipio_id,
      municipios ( nome )
    `)
    .order('nome', { ascending: true });

  if (error) {
    console.error("Erro ao buscar perfis:", error);
  }
  return { data, error };
}

/**
 * Funções de Busca Global para as novas páginas do Mandato
 */
export async function getTodasEmendas() {
  const supabase = await createClient();
  return supabase.from('emendas').select('*, municipios(nome)').order('ano', { ascending: false });
}

export async function getTodasObras() {
  const supabase = await createClient();
  return supabase.from('obras').select('*, municipios(nome)').order('titulo');
}

export async function getTodosEventos() {
  const supabase = await createClient();
  return supabase.from('eventos').select('*, municipios(nome)').order('data_hora', { ascending: false });
}

export async function getTodosContatos() {
  const supabase = await createClient();
  return supabase.from('contatos').select('*, municipios(nome), perfis(nome)').eq('status', 'aprovado').order('created_at', { ascending: false });
}
