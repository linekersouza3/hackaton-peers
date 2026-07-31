# ADR-001 - Pipeline segura e confiável para a LogiTrack

**Status:** Aceita  
**Data:** 31/07/2026

## Contexto

A pipeline atual executa em qualquer branch, expõe uma credencial no código e nos logs, instala dependências de maneira não determinística e simula testes, build e deploy. Como consequência, uma alteração quebrada pode chegar diretamente à produção sem validação, aprovação, confirmação de saúde ou mecanismo rápido de recuperação.

## Decisão

Adotaremos uma pipeline de CI/CD dividida em validação, segurança, construção e entrega.

Pull requests executarão instalação com `npm ci`, cache de dependências, testes automatizados, análise de vulnerabilidades com `npm audit` e build real da imagem Docker, sem realizar deploy.

A imagem será identificada pelo SHA do commit e analisada gratuitamente com o Trivy. Depois, será validada iniciando um container temporário e consultando o endpoint `/health`.

Os deploys serão limitados às branches `dev`, `staging` e `main`, associadas aos GitHub Environments `development`, `staging` e `production`. Cada ambiente manterá seus próprios secrets. Produção aceitará apenas a branch `main` e exigirá aprovação manual.

O deploy utilizará blue/green: a nova imagem será publicada no ambiente inativo, validada pelo health check e somente então receberá o tráfego. Se a validação falhar, a troca não ocorrerá e a versão atual continuará ativa. Após uma troca bem-sucedida, a versão anterior será mantida temporariamente para permitir rollback automático ou manual.

Também serão declaradas permissões mínimas para o `GITHUB_TOKEN` e controle de concorrência por ambiente, impedindo dois deploys simultâneos.

## Consequências

A solução aumenta o tempo da pipeline e exige a configuração inicial dos GitHub Environments. Em contrapartida, oferece builds reproduzíveis, bloqueio de alterações quebradas, proteção de credenciais, análise gratuita de vulnerabilidades, rastreabilidade por commit, aprovação de produção, validação real do serviço e recuperação em poucos minutos.
