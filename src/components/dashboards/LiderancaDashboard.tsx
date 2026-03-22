import { MapPin } from "lucide-react";
import { getLiderancaDashboardData } from "@/lib/supabase/api";
import { Perfil } from "@/lib/types";
import ImportVcf from "../lideranca/ImportVcf";

interface LiderancaDashboardProps {
  user: any; // Supabase user object
  perfil: Perfil;
}

export default async function LiderancaDashboard({ user, perfil }: LiderancaDashboardProps) {
  
  if (!perfil.municipio_id) {
    return <p className="text-center text-red">Erro: Perfil de liderança não está vinculado a um município.</p>;
  }

  const { data } = await getLiderancaDashboardData(user.id, perfil.municipio_id);

  return (
    <div className="w-full max-w-2xl mx-auto animate-fadeIn space-y-8 pb-20">
      <div className="vibe-card p-10! relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-all scale-150 rotate-12">
           <MapPin className="w-32 h-32 text-accent" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-6 bg-accent rounded-full"></div>
              <p className="vibe-stat-label mt-0! uppercase tracking-[0.3em] text-accent">
                Liderança · {data?.municipioNome || '...'}
              </p>
            </div>
            <h1 className="text-5xl font-display text-text italic">
              Seus <span className="text-accent underline decoration-accent/10 underline-offset-8">Contatos</span>
            </h1>
            <p className="text-lg text-muted/60 mt-4 font-medium italic">Olá, {perfil.nome || user.email}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumo */}
        <div className="vibe-card p-8 text-center group hover:border-accent/30 transition-all">
          <p className="text-5xl font-display text-accent group-hover:scale-110 transition-transform">{data?.aprovadosCount ?? '_'}</p>
          <p className="vibe-stat-label mt-2">Aprovados</p>
        </div>
        <div className="vibe-card p-8 text-center group hover:border-accent/30 transition-all">
          <p className="text-5xl font-display text-text group-hover:scale-110 transition-transform">{data?.pendentesCount ?? '_'}</p>
          <p className="vibe-stat-label mt-2 text-muted">Pendentes</p>
        </div>
      </div>

      {/* Upload Box */}
      <div className="vibe-card p-10! border-accent/10 bg-accent/2">
        <h3 className="text-2xl font-display text-text mb-6 uppercase tracking-tight">Expandir a Rede</h3>
        <ImportVcf municipioId={perfil.municipio_id} />
      </div>

      {/* Histórico */}
      <div className="space-y-6">
        <h3 className="text-2xl font-display text-text px-4">Histórico de Envios</h3>
        <div className="vibe-card p-0! overflow-hidden">
          {data?.recentes && data.recentes.length > 0 ? (
            <div className="divide-y divide-black/5">
              {data.recentes.map(contato => (
                <div key={contato.id} className="flex justify-between items-center p-6 hover:bg-black/5 transition-all">
                  <span className="text-base font-black text-muted">{contato.nome}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${
                    contato.status === 'aprovado' 
                    ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                    : 'bg-accent/10 text-accent border-accent/20'
                  }`}>
                    {contato.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <p className="text-muted/60 font-medium font-display text-xl">Seu histórico de militância aparecerá aqui.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
