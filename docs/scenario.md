# Cenário: LogiTrack — Esteira em Chamas 🔥

A LogiTrack é uma startup fictícia que monitora esteiras (conveyor belts) de
centros de distribuição através de uma API simples. Na sexta-feira passada,
durante um deploy de rotina, a esteira — agora a de CI/CD — causou um
incidente:

- O time fez deploy direto pra produção, sem qualquer validação.
- Um token de deploy vazou em texto puro nos logs do pipeline.
- Quando o deploy quebrou o serviço, não havia como voltar rápido — o
  rollback foi manual e levou 3 horas.
- Ninguém percebeu o problema a tempo, porque não existe nenhuma métrica ou
  alerta configurado.

Seu time herdou essa pipeline. O desafio: destrinchar o
`.github/workflows/pipeline.yml` atual, identificar os problemas, e entregar
uma esteira de CI/CD confiável.

## O que seu time precisa entregar

1. **Confiabilidade** — nenhuma mudança quebrada pode passar despercebida;
   se algo falhar, o pipeline tem que travar antes de chegar em produção.
2. **Segurança de credenciais** — nenhuma credencial pode aparecer exposta
   em nenhum lugar (código, YAML, log de execução).
3. **Recuperação rápida** — se o deploy quebrar o serviço, o time precisa
   conseguir voltar ao estado anterior em minutos, não em horas, e
   demonstrar isso ao vivo.
4. **Disciplina de execução** — o pipeline não pode disparar
   descontroladamente a qualquer mudança, em qualquer lugar do
   repositório.
5. **Visibilidade** — alguém precisa conseguir saber, sem adivinhar, se o
   deploy realmente funcionou.
6. **Um ADR curto (meia página)** documentando as decisões técnicas do seu
   time e o porquê.

## Regras

- Cada time recebe o repo via "Use this template" e trabalha isolado no
  seu próprio repositório.
- Podem usar qualquer ferramenta vista na Sessão 02 (GitHub Actions,
  Docker, feature flags, gerenciamento de secrets, etc.) — não precisa ser
  literalmente Vault/Prometheus, pode ser simulado.
- Ao final, cada time demonstra ao vivo: um deploy passando e, em seguida,
  simula uma falha para mostrar como fariam o rollback.

## Critérios de avaliação

| Dimensão | O que avaliamos |
|---|---|
| Ferramentas | A pipeline usa as ferramentas certas, bem configuradas (Actions, Docker) |
| Práticas | Testes realmente bloqueiam o merge, disciplina de branch/trigger, alguma forma de blue/green ou feature flag |
| Governança | Secrets fora do código, log/observabilidade mínima, plano de rollback demonstrável |

## Rodando localmente

```bash
cd app
npm install
npm test
npm start
```
