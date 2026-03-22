import { getContatosPendentes, getPerfisPendentes } from "@/lib/supabase/api";
import { approveContact, rejectContact, updateUserProfile } from "@/app/assessoria/actions";
import { Check, X, User, MapPin, CheckCircle, ShieldAlert } from "lucide-react";

export default async function AprovalQueue() {
  const [contatosRes, perfisRes] = await Promise.all([
    getContatosPendentes(),
    getPerfisPendentes()
  ]);
  
  const contatos = (contatosRes.data || []) as any[];
  const perfis = (perfisRes.data || []) as any[];
  
  // Filtragem extra caso o banco retorne perfis que não são realmente pendentes
  const perfisRealmentePendentes = perfis.filter(p => p.status === 'pendente');

  if (contatos.length === 0 && perfisRealmentePendentes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted/40 text-center">
        <CheckCircle className="w-12 h-12 mb-4 opacity-10" />
        <p className="text-sm font-medium">Tudo em ordem por aqui!</p>
        <p className="text-[10px] uppercase tracking-widest mt-1">Nenhuma solicitação pendente</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Seção de Novos Usuários (Acesso ao Sistema) */}
      {perfisRealmentePendentes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent px-2 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Solicitações de Acesso
          </h3>
          {perfisRealmentePendentes.map((perfil) => (
            <div key={perfil.id} className="vibe-card p-4! border-accent/20 bg-accent/2 flex flex-col md:flex-row justify-between items-center gap-4 animate-fadeIn">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{perfil.nome || "Novo Usuário"}</p>
                  <p className="text-[10px] text-muted font-medium uppercase tracking-wider">Solicitou acesso ao sistema</p>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <form action={updateUserProfile.bind(null, perfil.id, 'deputado', null)} className="flex-1 md:flex-none">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg bg-accent text-bg hover:opacity-80 transition-all">
                    Aprovar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seção de Contatos (Militância) */}
      {contatos.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted px-2">
            Contatos de Municípios
          </h3>
          {contatos.map((contato) => {
            const perfilNome = Array.isArray(contato.perfis) ? contato.perfis[0]?.nome : contato.perfis?.nome;
            const municipioNome = Array.isArray(contato.municipios) ? contato.municipios[0]?.nome : contato.municipios?.nome;

            return (
              <div key={contato.id} className="vibe-card p-4! border-black/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-black/2 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">{contato.nome}</p>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-muted font-medium uppercase tracking-wider">
                      <span className="flex items-center gap-1 font-black">
                        <MapPin className="w-3 h-3" /> {municipioNome || '...'}
                      </span>
                      <span className="opacity-40">Enviado por: {perfilNome || '...'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <form action={approveContact.bind(null, contato.id)} className="flex-1 md:flex-none">
                    <button type="submit" className="w-full text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg border border-black/5 hover:bg-green hover:text-white transition-all">
                      Aprovar
                    </button>
                  </form>
                  <form action={rejectContact.bind(null, contato.id)} className="flex-1 md:flex-none">
                    <button type="submit" className="w-full text-[10px] font-bold uppercase tracking-widest py-2 px-4 rounded-lg border border-black/5 hover:bg-red hover:text-white transition-all">
                      Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
