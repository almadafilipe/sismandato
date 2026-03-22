-- 1. Criar o tipo de status se não existir (ou apenas usar texto)
-- Vamos usar texto para ser mais flexível neste momento
ALTER TABLE public.perfis ADD COLUMN IF NOT EXISTS status text DEFAULT 'pendente';

-- 2. Atualizar usuários existentes para 'aprovado' para não bloqueá-los
UPDATE public.perfis SET status = 'aprovado' WHERE role IN ('assessoria', 'lideranca');
UPDATE public.perfis SET status = 'aprovado' WHERE status IS NULL;

-- 3. Atualizar a função do trigger para definir o status como 'pendente' por padrão
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.perfis (id, nome, role, status)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', 'deputado', 'pendente');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
