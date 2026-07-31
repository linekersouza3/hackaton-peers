# Problemas e soluções — Pipeline LogiTrack

Mapeamento entre a pipeline legado (quebrada de propósito) e a solução adotada na [ADR-001](adr-001-pipeline-ci-cd.md).

| Problema | Onde estava | Solução |
|---|---|---|
| Pipeline disparava em qualquer branch (`**`) | `on.push.branches` | Triggers apenas em `pull_request` e `push` para `dev`, `staging` e `main`, além de `workflow_dispatch` controlado |
| Token de deploy em texto puro no YAML | `env.DEPLOY_TOKEN` | Secret `DEPLOY_TOKEN` por GitHub Environment (`development`, `staging`, `production`) |
| Token ecoado nos logs | `echo ... $DEPLOY_TOKEN` | Uso via `${{ secrets.DEPLOY_TOKEN }}` sem `echo` do valor (máscara nativa do Actions) |
| `npm install` não determinístico | step de instalação | `npm ci` com cache (`actions/setup-node` + `package-lock.json`) |
| Testes pulados (`echo "Tests skipped"`) | job `build` | Job `validate` executa `npm test` de verdade e bloqueia o fluxo se falhar |
| Sem análise de vulnerabilidades de dependências | ausente | `npm audit --audit-level=high` no job `validate` |
| Build Docker apenas simulado | `echo "Building docker image..."` | `docker build` real da imagem em `app/` |
| Imagem sem identificação rastreável | ausente | Tag `ghcr.io/<owner>/<repo>/logitrack-api:<sha>` |
| Sem scan de vulnerabilidades da imagem | ausente | Trivy (`CRITICAL,HIGH`) com `exit-code: 1` |
| Sem confirmação de que o serviço sobe | ausente | Smoke test: container temporário + `GET /health` |
| Deploy direto em produção sem gates | job `deploy` incondicional | Deploy só após CI verde; PRs nunca fazem deploy |
| Sem ambientes separados | ausente | Branches `dev`/`staging`/`main` → Environments `development`/`staging`/`production` |
| Produção sem aprovação humana | ausente | Environment `production` com required reviewers (configuração no GitHub) |
| Sem blue/green | deploy único | Publicação no slot inativo → health check → promoção; falha mantém versão ativa |
| Sem rollback rápido | rollback manual (~3h no incidente) | Job `rollback` via `workflow_dispatch` usando a imagem anterior persistida |
| Sem permissões mínimas do token | defaults amplos | `permissions` explícitas: `contents: read`, `packages: write`, `security-events: write` |
| Deploys concorrentes possíveis | ausente | `concurrency` por ambiente/ref com `cancel-in-progress: false` |
| Sem visibilidade do resultado do deploy | apenas `echo` | Job Summary com slot ativo, imagem, SHA e status da promoção |

## Fluxo resumido

1. **PR** → validate + build + Trivy + smoke (sem deploy, sem push da imagem)
2. **Push** em `dev` / `staging` / `main` → CI completo + push GHCR + deploy blue/green no environment correspondente
3. **workflow_dispatch** `deploy` → mesmo caminho de entrega no environment escolhido
4. **workflow_dispatch** `rollback` → restaura a imagem/slot anterior após health check
