# LogiTrack API

API de monitoramento de esteiras de um centro de distribuição fictício —
material do **Hackathon 2 (Sessão 02 · CI/CD e Cultura DevOps)** do
DevTalks 2026, Peers Engenharia de Software.

👉 Comece lendo [`docs/scenario.md`](docs/scenario.md) para o briefing
completo do desafio.

Decisões técnicas: [`docs/adr-001-pipeline-ci-cd.md`](docs/adr-001-pipeline-ci-cd.md)  
Problemas corrigidos: [`docs/problemas-e-solucoes.md`](docs/problemas-e-solucoes.md)

## Stack

- Node.js + Express
- Jest + Supertest (testes)
- Docker
- GitHub Actions (`.github/workflows/pipeline.yml`)
- GHCR + Trivy (imagem e scan)
- GitHub Environments (secrets e aprovação de produção)

## Rodando localmente

```bash
cd app
npm install
npm test
npm start
```

## Configuração dos GitHub Environments

Antes do primeiro deploy, configure no repositório (**Settings → Environments**):

| Environment | Branch de deploy | Secrets | Protection rules |
|---|---|---|---|
| `development` | `dev` | `DEPLOY_TOKEN` | — |
| `staging` | `staging` | `DEPLOY_TOKEN` | — |
| `production` | `main` | `DEPLOY_TOKEN` | **Required reviewers** (aprovação manual) |

Crie também as branches `dev` e `staging` se ainda não existirem.

O valor de `DEPLOY_TOKEN` pode ser qualquer string secreta de demonstração — **nunca** coloque o token no YAML nem faça `echo` dele nos steps.

## Como a pipeline funciona

| Evento | O que roda |
|---|---|
| Pull request → `dev` / `staging` / `main` | `npm ci`, testes, `npm audit`, build Docker, Trivy, smoke `/health` — **sem deploy** |
| Push em `dev` | CI + push da imagem no GHCR + deploy blue/green em `development` |
| Push em `staging` | CI + push + deploy em `staging` |
| Push em `main` | CI + push + deploy em `production` (aguarda aprovação) |
| `workflow_dispatch` → `deploy` | Deploy no environment escolhido |
| `workflow_dispatch` → `rollback` | Restaura a versão anterior do environment |

Imagem: `ghcr.io/<owner>/<repo>/logitrack-api:<sha>`

## Demo ao vivo (deploy + falha + rollback)

1. **Deploy saudável:** faça push em `dev` (ou rode o workflow com `action=deploy`, `environment=development`) e confira o Job Summary (slot ativo, SHA, health OK).
2. **Simular falha:** introduza uma mudança que quebre `/health` ou os testes; o job `validate`/`build` falha e o deploy **não** promove o slot inativo.
3. **Rollback:** em **Actions → LogiTrack Pipeline → Run workflow**, escolha `action=rollback` e o environment desejado. A pipeline recoloca a imagem anterior e valida `/health` de novo.
