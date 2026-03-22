'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/assessoria/actions';

interface Perfil {
  id: string;
  nome: string;
  role: 'deputado' | 'lideranca' | 'assessoria';
  municipio_id: string | null;
  municipios?: { nome: string } | null;
}

interface Municipio {
  id: string;
  nome: string;
}

import { UserCircle, MapPin, Edit2, Check, X as Close } from "lucide-react";

export default function UserManagement({
  perfis,
  municipios
}: {
  perfis: Perfil[];
  municipios: Municipio[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'deputado' | 'lideranca' | 'assessoria'>('deputado');
  const [editMunicipio, setEditMunicipio] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [localPerfis, setLocalPerfis] = useState(perfis);

  const startEditing = (p: Perfil) => {
    setEditingId(p.id);
    setEditRole(p.role);
    setEditMunicipio(p.municipio_id || '');
  };

  const handleSave = async (userId: string) => {
    if (editRole === 'lideranca' && !editMunicipio) {
      alert('Atenção: Para o nível de Líder, é obrigatório selecionar um Município.');
      return;
    }

    try {
      setIsSaving(true);
      const targetMunicipio = editRole === 'lideranca' ? (editMunicipio || null) : null;
      await updateUserProfile(userId, editRole, targetMunicipio);
      
      setLocalPerfis(prev => prev.map(p => {
        if (p.id === userId) {
          const m = municipios.find(m => m.id === targetMunicipio);
          return {
            ...p,
            role: editRole,
            municipio_id: targetMunicipio,
            municipios: m ? { nome: m.nome } : null
          };
        }
        return p;
      }));
      setEditingId(null);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert('Falha ao salvar: ' + (err instanceof Error ? err.message : 'Erro desconhecido no servidor'));
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'assessoria': return "bg-purple/10 text-purple border-purple/20";
      case 'lideranca': return "bg-blue/10 text-blue border-blue/20";
      default: return "bg-white/5 text-muted border-white/10";
    }
  };

  return (
    <div className="space-y-3">
      {localPerfis.map(p => {
        const isEditing = editingId === p.id;
        return (
          <div key={p.id} className="vibe-card p-3! border-border/40 hover:border-accent/20 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted group-hover:text-accent transition-colors">
                  <UserCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">{p.nome}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getRoleStyle(p.role)}`}>
                      {p.role === 'assessoria' ? 'Admin' : p.role === 'lideranca' ? 'Líder' : 'Deputado'}
                    </span>
                    {p.role === 'lideranca' && (
                      <span className="flex items-center gap-1 text-[10px] text-muted">
                        <MapPin className="w-3 h-3" />
                        {p.municipios?.nome || "Sem vínculo"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex flex-wrap items-center gap-2 animate-fadeIn">
                    <select 
                      title="Nível de Acesso"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as Perfil['role'])}
                      className="glass-input text-[10px] font-bold py-1 px-2 uppercase tracking-wider min-w-[120px]"
                    >
                      <option value="deputado">Deputado</option>
                      <option value="lideranca">Líder</option>
                      <option value="assessoria">Admin</option>
                    </select>
                    {editRole === 'lideranca' && (
                      <select 
                        title="Município Vinculado"
                        value={editMunicipio}
                        onChange={(e) => setEditMunicipio(e.target.value)}
                        className="glass-input text-[10px] font-bold py-1 px-2 uppercase tracking-wider min-w-[150px]"
                      >
                        <option value="">Município...</option>
                        {municipios.map(m => <option key={m.id} value={m.id}>{m.nome}</option>)}
                      </select>
                    )}
                    <button 
                      title="Salvar Alterações"
                      disabled={isSaving}
                      onClick={() => handleSave(p.id)} 
                      className="p-1.5 rounded-lg bg-accent text-bg hover:opacity-80 transition-opacity disabled:opacity-50"
                    >
                      {isSaving ? "..." : <Check className="w-4 h-4" />}
                    </button>
                    <button 
                      title="Cancelar Edição"
                      onClick={() => setEditingId(null)} 
                      className="p-1.5 rounded-lg bg-white/5 text-muted hover:text-text"
                    >
                      <Close className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    title="Editar Usuário"
                    onClick={() => startEditing(p)} 
                    className="p-2 rounded-lg bg-white/5 text-muted opacity-0 group-hover:opacity-100 hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
