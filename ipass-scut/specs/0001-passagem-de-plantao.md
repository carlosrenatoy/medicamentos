# 0001 — Passagem de plantão (handoff I-PASS)

## Problema

Hoje, em ambientes de pronto-socorro pediátrico, a passagem de plantão é feita verbalmente ou em rascunhos de papel/whiteboard. Informação se perde entre turnos, gerando re-trabalho clínico (re-pedir exames, re-medicar) e risco de erro. O sistema precisa registrar e estruturar a passagem usando o protocolo **I-PASS** (Illness severity, Patient summary, Action list, Situation awareness, Synthesis by receiver) traduzido para o contexto BR.

## Usuários

- [x] Médico plantonista (lê e escreve durante o plantão)
- [x] Médico coordenador (lê para dashboard de gravidade)
- [x] Enfermagem (lê pendências e prescrições)

## Critérios de aceitação

**Cenário 1: registrar paciente novo**

- **Dado** que o plantonista está logado em uma view (Retaguarda ou Porta)
- **Quando** clicar em "Novo Paciente" e preencher: nome, idade, leito, RGHC, DIH, peso, alergia, gravidade (`stable|alert|unstable`), sistemas afetados, e os campos I-PASS (`previo`, `atual`, `hpma`, `labs`, `imagem`, `infeccioso`, `prescricao`, `muc`, `dieta`, `pendencias`, `recebeu`, `sv`, `scatsObs`)
- **Então** o paciente aparece imediatamente na lista da view, no card do leito correspondente, com o ícone de gravidade certo
- **E** uma linha é gravada em `audit_log` com `action='create'`, `actor=auth.uid()`, `entity='patients'`, `diff={...campos}`

**Cenário 2: editar campo durante plantão**

- **Dado** um paciente já cadastrado
- **Quando** o plantonista abrir o painel de edição e alterar `ipass.atual`
- **Então** o salvamento é debounced (não salva a cada tecla; salva 1s após parar de digitar)
- **E** o indicador "✓ Salvo" pisca confirmando
- **E** o `audit_log` recebe linha com `diff` mostrando o campo antes/depois

**Cenário 3: filtrar críticos**

- **Dado** múltiplos pacientes com gravidades variadas
- **Quando** o coordenador clicar no filtro "Críticos"
- **Então** só os pacientes com `gravity='unstable'` aparecem
- **E** o contador no header reflete a quantidade

**Cenário 4: paciente recebe alta**

- **Dado** um paciente ativo
- **Quando** o plantonista marcar `active=false` (alta)
- **Então** o paciente sai da lista padrão (filtro "Ativos")
- **Mas** continua acessível em "Histórico" com timestamp da alta
- **E** `audit_log` recebe linha com `action='discharge'`

## Fora do escopo

- Prescrição eletrônica integrada com farmácia (vira spec separada)
- Integração com sistemas hospitalares externos (HL7, FHIR)
- App mobile nativo (PWA via responsivo já é suficiente)
- Resumo IA — coberto por spec `0003-gemini-ai-resumos.md`

## Perguntas em aberto

- [ ] Quem pode dar alta — só médico ou também enfermagem? (provavelmente só médico — confirmar com `buxo.pdf`)
- [ ] O que acontece com `audit_log` após N anos? (LGPD permite retenção mas exige finalidade — anonimizar após 5 anos?)
- [ ] Pacientes excluídos por engano: undo dentro de 30s ou apenas via `audit_log` admin?

## Referências

- `buxo.pdf` (a extrair páginas exatas conforme leitura incremental)
- Convenção I-PASS: protocolo internacional de handoff (Starmer et al., 2014, NEJM)
- Stack: ADR `docs/adr/0001-supabase-vs-vps.md`
