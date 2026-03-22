'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function updateContactStatus(contactId: string, status: 'aprovado' | 'rejeitado') {
  const supabase = await createClient();

  // TODO: Adicionar verificação se o usuário tem a role 'assessoria'

  const { error } = await supabase
    .from('contatos')
    .update({ status: status })
    .eq('id', contactId);

  if (error) {
    console.error(`Erro ao ${status === 'aprovado' ? 'aprovar' : 'rejeitar'} contato:`, error);
    throw new Error('Falha ao atualizar status do contato.');
  }

  revalidatePath('/'); // Revalida o dashboard para atualizar as listas
}

export async function approveContact(contactId: string) {
  return updateContactStatus(contactId, 'aprovado');
}

export async function rejectContact(contactId: string) {
  return updateContactStatus(contactId, 'rejeitado');
}

export async function updateUserProfile(userId: string, targetRole: 'deputado' | 'lideranca' | 'assessoria', targetMunicipioId: string | null) {
  const supabase = await createClient();

  // Validate the inputs (if not lideranca, municipio should be null)
  const safeMunicipioId = targetRole === 'lideranca' ? targetMunicipioId : null;

  try {
    const { error } = await supabase
      .from('perfis')
      .update({ 
        role: targetRole,
        status: 'aprovado',
        municipio_id: safeMunicipioId
      })
      .eq('id', userId);

    if (error) {
       console.error(`Erro Supabase ao atualizar perfil:`, error);
       return { success: false, error: error.message };
    }

    revalidatePath('/'); // Revalida o dashboard principal
    return { success: true };
  } catch (e: any) {
    console.error(`Erro interno ao atualizar perfil:`, e);
    return { success: false, error: e.message || 'Erro interno inesperado' };
  }
}

/**
 * Versão compatível com formulários de servidor (Server Components)
 * que não suportam objetos de retorno complexos diretamente no atributo 'action'.
 */
export async function approveUserFormAction(userId: string) {
  const result = await updateUserProfile(userId, 'deputado', null);
  if (!result.success) {
    throw new Error(result.error);
  }
}

export async function createMunicipio(nome: string, regiao?: string, populacao?: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('municipios')
    .insert([{ nome, regiao, populacao }])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar município:", error);
    throw new Error('Falha ao criar município.');
  }

  revalidatePath('/');
  return data;
}

export async function promoteToAssessoria() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from('perfis')
    .update({ role: 'assessoria' })
    .eq('id', user.id);

  if (error) {
    console.error("Erro ao promover usuário:", error);
    throw new Error("Falha na promoção de acesso.");
  }

  revalidatePath('/');
}
