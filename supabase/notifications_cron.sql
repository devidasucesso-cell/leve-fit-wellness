-- ==============================================================================
-- AUTOMATIZAÇÃO DE NOTIFICAÇÕES (CRON JOB)
-- Execute este script no SQL Editor do Supabase para agendar as notificações diárias.
-- ==============================================================================

-- 1. Habilitar a extensão pg_cron (se ainda não estiver habilitada)
create extension if not exists pg_cron;

-- 2. Habilitar a extensão pg_net (necessária para chamar a Edge Function)
create extension if not exists pg_net;

-- 3. Agendar o Job para rodar todos os dias às 09:00 (Horário do Brasil ~ 12:00 UTC)
-- Substitua YOUR_PROJECT_REF pela referência do seu projeto (ex: abcdefgh)
-- Substitua YOUR_SERVICE_ROLE_KEY pela chave 'service_role' do seu projeto (Project Settings > API)

select cron.schedule(
  'send-journey-notifications-daily', -- Nome do job
  '0 12 * * *',                       -- Cron expression (12:00 UTC = 09:00 BRT)
  $$
  select
    net.http_post(
      url:='https://YOUR_PROJECT_REF.functions.supabase.co/schedule-notifications',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{"type": "journey_daily"}'::jsonb
    ) as request_id;
  $$
);

-- Para verificar se o job foi criado:
-- select * from cron.job;

-- Para remover o job se precisar ajustar:
-- select cron.unschedule('send-journey-notifications-daily');
