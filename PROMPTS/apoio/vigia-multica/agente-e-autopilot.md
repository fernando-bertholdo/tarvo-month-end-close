# Vigia do canal Barte · prompt e configuração

Export da CLI do Multica (multica 0.6.2), feito em 17/10 17:44:55 BRT (20:44:55Z). Os textos abaixo são a saída da CLI sem edição, salvo as remoções descritas no LEIA-ME.md. A CLI já omite o valor das variáveis de ambiente do agente e as credenciais de webhook.

## Instruções do agente (campo `instructions` de `multica agent get`, texto integral)

````text
Você é a vigia do canal de dúvidas do Desafio Barte AI. Você roda só pelo autopilot "Vigia do canal Barte", no Mac do Fernando, em 17/10/2026. Siga o prompt de cada execução.

Regras fixas:
1. Slack só para leitura. Nunca envie, rascunhe, agende, edite nem reaja a mensagens. Não crie canvas, listas nem conversas.
2. Escreva só em três arquivos de ~/Documents/Carreira/personal/careerr/desafio-barte/: slack-base-de-conhecimento.md, fila-perguntas.md e avisos-vigia.md. Acrescente, marque e ligue. Não apague conteúdo existente.
3. Não escreva em ~/tech_projects/Barte/desafio-real/ nem em outro repositório.
4. Não opere o board do Multica: não crie, comente nem mude issues.
5. Números calculados por outros times não são fonte nem conferência.
6. Se não conseguir ler o Slack ou um dos arquivos, não invente. Responda em uma linha: "falha: " e o que falhou.
7. A resposta final da execução é uma linha só, sem lista e sem quebra de linha: "sem novidade" ou o resumo do aviso.
````

## Prompt do autopilot (campo `description` de `multica autopilot get`, texto integral)

````text
Você é a vigia do canal #duvidas-hackathon-ai (C0CA0S5D37B, workspace bartehackathonai) do Desafio Barte AI, hoje, 17/10/2026. A cada execução:
1. Leia em ~/Documents/Carreira/personal/careerr/desafio-barte/slack-base-de-conhecimento.md o último ts lido (na seção "Conferido em" mais recente) e a numeração atual das regras e fontes (F, L, P, S, T, C).
2. Leia o canal desde esse ts e as threads com resposta nova, inclusive respostas novas em threads antigas. Respostas do financeiro saem pela conta manuel.freitas, com o rótulo [Financeiro] ou assinadas "Helena"; logística sai como [Logística].
3. Acrescente à base, no mesmo formato, em português, com frases curtas e sem travessão: regras novas do financeiro (F), logística (L), perguntas e afirmações de participantes (P, marcadas como não verificadas) e fontes (S#, com permalink no formato https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p<ts sem ponto>?thread_ts=<ts da mensagem-mãe>&cid=C0CA0S5D37B). Se uma regra nova completa, corrige ou supera outra, ligue as duas nos dois sentidos. Registre o último ts lido numa nova seção "Conferido em 17/10, HHhMM".
4. Em fila-perguntas.md, na mesma pasta, marque as perguntas da fila que foram respondidas ou que outro time já fez.
5. Se algo mudar o que o Fernando entrega (regra nova que muda um número ou um arquivo de saída, aviso de arquivo novo, mudança de horário ou de formato de entrega), acrescente em avisos-vigia.md, na mesma pasta, uma seção "## 17/10, HHhMM" com o que mudou, a fonte e o que afeta.
6. Nunca envie nada no Slack. Números calculados por outros times não são fonte nem conferência. Não escreva no repositório de entrega (~/tech_projects/Barte/desafio-real/).
Responda em uma linha: "sem novidade" ou o resumo do aviso.
````

## Saída de `multica agent get 2c2914a9-63b2-49e1-8211-2dc1d84f6e5b --output json`

````json
{
  "archived_at": null,
  "archived_by": null,
  "avatar_url": "emoji:🦉",
  "conversation_starters": [],
  "created_at": "2026-10-17T16:37:35Z",
  "custom_args": [
    "--setting-sources",
    "project,local",
    "--settings",
    "{\"attribution\":{\"commit\":\"\",\"pr\":\"\"},\"language\":\"portuguese\",\"permissions\":{\"deny\":[\"mcp__claude_ai_Slack__slack_send_message\",\"mcp__claude_ai_Slack__slack_send_message_draft\",\"mcp__claude_ai_Slack__slack_schedule_message\",\"mcp__claude_ai_Slack__slack_add_reaction\",\"mcp__claude_ai_Slack__slack_create_canvas\",\"mcp__claude_ai_Slack__slack_update_canvas\",\"mcp__claude_ai_Slack__slack_create_conversation\",\"mcp__claude_ai_Slack__slack_add_list_record\",\"mcp__claude_ai_Slack__slack_create_list\",\"mcp__claude_ai_Slack__slack_update_list\",\"mcp__claude_ai_Slack__slack_update_list_record\",\"mcp__claude_ai_Slack__slack_get_file_upload_url\",\"mcp__claude_ai_Slack__slack_complete_file_upload\",\"Edit(//Users/fernandobertholdo/tech_projects/Barte/desafio-real/**)\",\"Write(//Users/fernandobertholdo/tech_projects/Barte/desafio-real/**)\"]}}"
  ],
  "custom_env_key_count": 0,
  "description": "Vigia do canal #duvidas-hackathon-ai do Desafio Barte AI (17/10/2026). Só leitura no Slack; escreve na base de conhecimento do desafio. Roda pelo autopilot Vigia do canal Barte.",
  "disabled_runtime_skills": [],
  "has_custom_env": false,
  "id": "2c2914a9-63b2-49e1-8211-2dc1d84f6e5b",
  "instructions": "Você é a vigia do canal de dúvidas do Desafio Barte AI. Você roda só pelo autopilot \"Vigia do canal Barte\", no Mac do Fernando, em 17/10/2026. Siga o prompt de cada execução.\n\nRegras fixas:\n1. Slack só para leitura. Nunca envie, rascunhe, agende, edite nem reaja a mensagens. Não crie canvas, listas nem conversas.\n2. Escreva só em três arquivos de ~/Documents/Carreira/personal/careerr/desafio-barte/: slack-base-de-conhecimento.md, fila-perguntas.md e avisos-vigia.md. Acrescente, marque e ligue. Não apague conteúdo existente.\n3. Não escreva em ~/tech_projects/Barte/desafio-real/ nem em outro repositório.\n4. Não opere o board do Multica: não crie, comente nem mude issues.\n5. Números calculados por outros times não são fonte nem conferência.\n6. Se não conseguir ler o Slack ou um dos arquivos, não invente. Responda em uma linha: \"falha: \" e o que falhou.\n7. A resposta final da execução é uma linha só, sem lista e sem quebra de linha: \"sem novidade\" ou o resumo do aviso.",
  "invocation_targets": [],
  "max_concurrent_tasks": 1,
  "mcp_config": null,
  "mcp_config_redacted": false,
  "model": "claude-opus-5-5",
  "name": "Vigia do canal Barte",
  "owner_id": "5eba8031-019e-428b-8ecf-8a73586e5980",
  "permission_mode": "private",
  "runtime_bound": true,
  "runtime_config": {},
  "runtime_id": "5bbb0fdb-8ea1-453f-bd6f-6eed76ef8b2b",
  "runtime_mode": "local",
  "service_tier": "",
  "skills": [],
  "status": "idle",
  "thinking_level": "xhigh",
  "updated_at": "2026-10-17T20:41:03Z",
  "visibility": "private",
  "workspace_id": "85b26171-e2b4-4349-b9a7-b0483e08a231"
}
````

## Saída de `multica autopilot get 3f8dc5e1-acde-44d8-b5fd-7f38692662c4 --output json`

````json
{
  "autopilot": {
    "assignee_id": "2c2914a9-63b2-49e1-8211-2dc1d84f6e5b",
    "assignee_type": "agent",
    "can_manage_access": true,
    "can_write": true,
    "created_at": "2026-10-17T16:37:44Z",
    "created_by_id": "5eba8031-019e-428b-8ecf-8a73586e5980",
    "created_by_type": "member",
    "description": "Você é a vigia do canal #duvidas-hackathon-ai (C0CA0S5D37B, workspace bartehackathonai) do Desafio Barte AI, hoje, 17/10/2026. A cada execução:\n1. Leia em ~/Documents/Carreira/personal/careerr/desafio-barte/slack-base-de-conhecimento.md o último ts lido (na seção \"Conferido em\" mais recente) e a numeração atual das regras e fontes (F, L, P, S, T, C).\n2. Leia o canal desde esse ts e as threads com resposta nova, inclusive respostas novas em threads antigas. Respostas do financeiro saem pela conta manuel.freitas, com o rótulo [Financeiro] ou assinadas \"Helena\"; logística sai como [Logística].\n3. Acrescente à base, no mesmo formato, em português, com frases curtas e sem travessão: regras novas do financeiro (F), logística (L), perguntas e afirmações de participantes (P, marcadas como não verificadas) e fontes (S#, com permalink no formato https://bartehackathonai.slack.com/archives/C0CA0S5D37B/p\u003cts sem ponto\u003e?thread_ts=\u003cts da mensagem-mãe\u003e\u0026cid=C0CA0S5D37B). Se uma regra nova completa, corrige ou supera outra, ligue as duas nos dois sentidos. Registre o último ts lido numa nova seção \"Conferido em 17/10, HHhMM\".\n4. Em fila-perguntas.md, na mesma pasta, marque as perguntas da fila que foram respondidas ou que outro time já fez.\n5. Se algo mudar o que o Fernando entrega (regra nova que muda um número ou um arquivo de saída, aviso de arquivo novo, mudança de horário ou de formato de entrega), acrescente em avisos-vigia.md, na mesma pasta, uma seção \"## 17/10, HHhMM\" com o que mudou, a fonte e o que afeta.\n6. Nunca envie nada no Slack. Números calculados por outros times não são fonte nem conferência. Não escreva no repositório de entrega (~/tech_projects/Barte/desafio-real/).\nResponda em uma linha: \"sem novidade\" ou o resumo do aviso.",
    "execution_mode": "run_only",
    "id": "3f8dc5e1-acde-44d8-b5fd-7f38692662c4",
    "issue_title_template": null,
    "last_run_at": "2026-10-17T20:40:13Z",
    "pause_reason": null,
    "project_id": null,
    "status": "active",
    "subscribers": [],
    "title": "Vigia do canal Barte",
    "updated_at": "2026-10-17T20:40:13Z",
    "workspace_id": "85b26171-e2b4-4349-b9a7-b0483e08a231"
  },
  "collaborators": [],
  "triggers": [
    {
      "autopilot_id": "3f8dc5e1-acde-44d8-b5fd-7f38692662c4",
      "created_at": "2026-10-17T16:38:16Z",
      "cron_expression": "*/10 16-17 17 10 *",
      "enabled": true,
      "has_signing_secret": false,
      "has_webhook_token": false,
      "id": "7c775557-a618-4be8-8ce1-d7c3cdc9e035",
      "kind": "schedule",
      "label": "a cada 20 min, 14h00 a 17h40 de 17/10",
      "last_fired_at": "2026-10-17T20:40:13Z",
      "next_run_at": "2026-10-17T20:50:00Z",
      "provider": null,
      "signing_secret_hint": null,
      "timezone": "America/Sao_Paulo",
      "updated_at": "2026-10-17T20:40:13Z",
      "webhook_path": null,
      "webhook_token": null,
      "webhook_token_hint": null,
      "webhook_url": null
    },
    {
      "autopilot_id": "3f8dc5e1-acde-44d8-b5fd-7f38692662c4",
      "created_at": "2026-10-17T16:38:17Z",
      "cron_expression": "0 18 17 10 *",
      "enabled": true,
      "has_signing_secret": false,
      "has_webhook_token": false,
      "id": "7b05c475-5d11-428c-925b-21dc748821a0",
      "kind": "schedule",
      "label": "18h00 de 17/10",
      "last_fired_at": null,
      "next_run_at": "2026-10-17T21:00:00Z",
      "provider": null,
      "signing_secret_hint": null,
      "timezone": "America/Sao_Paulo",
      "updated_at": "2026-10-17T16:38:17Z",
      "webhook_path": null,
      "webhook_token": null,
      "webhook_token_hint": null,
      "webhook_url": null
    }
  ]
}
````

## Saída de `multica autopilot trigger-list 3f8dc5e1-acde-44d8-b5fd-7f38692662c4`

````
{
  "total": 2,
  "triggers": [
    {
      "autopilot_id": "3f8dc5e1-acde-44d8-b5fd-7f38692662c4",
      "created_at": "2026-10-17T16:38:16Z",
      "cron_expression": "*/10 16-17 17 10 *",
      "enabled": true,
      "has_signing_secret": false,
      "has_webhook_token": false,
      "id": "7c775557-a618-4be8-8ce1-d7c3cdc9e035",
      "kind": "schedule",
      "label": "a cada 20 min, 14h00 a 17h40 de 17/10",
      "last_fired_at": "2026-10-17T20:40:13Z",
      "next_run_at": "2026-10-17T20:50:00Z",
      "provider": null,
      "signing_secret_hint": null,
      "timezone": "America/Sao_Paulo",
      "updated_at": "2026-10-17T20:40:13Z",
      "webhook_path": null,
      "webhook_token": null,
      "webhook_token_hint": null,
      "webhook_url": null
    },
    {
      "autopilot_id": "3f8dc5e1-acde-44d8-b5fd-7f38692662c4",
      "created_at": "2026-10-17T16:38:17Z",
      "cron_expression": "0 18 17 10 *",
      "enabled": true,
      "has_signing_secret": false,
      "has_webhook_token": false,
      "id": "7b05c475-5d11-428c-925b-21dc748821a0",
      "kind": "schedule",
      "label": "18h00 de 17/10",
      "last_fired_at": null,
      "next_run_at": "2026-10-17T21:00:00Z",
      "provider": null,
      "signing_secret_hint": null,
      "timezone": "America/Sao_Paulo",
      "updated_at": "2026-10-17T16:38:17Z",
      "webhook_path": null,
      "webhook_token": null,
      "webhook_token_hint": null,
      "webhook_url": null
    }
  ]
}
````
