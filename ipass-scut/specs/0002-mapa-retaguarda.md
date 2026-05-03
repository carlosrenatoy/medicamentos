# 0002 — Mapa interativo da retaguarda

## Problema

A retaguarda tem 17 leitos numerados + 3 áreas (Estabilização, Emergência, Procedimentos), distribuídos espacialmente conforme a planta `assets/planta_ps.png`. Plantonistas precisam ver de relance "qual leito está ocupado, por quem, e qual a gravidade", não rolando uma lista. Lista é boa para dashboards; mapa é o que se olha enquanto se anda pela ala.

## Usuários

- [x] Médico plantonista (uso primário)
- [x] Médico coordenador (visão de capacidade)
- [x] Enfermagem (saber onde está cada paciente)

## Critérios de aceitação

**Cenário 1: visualização do mapa**

- **Dado** que o usuário está em `mapa-retaguarda.html` (ou clicou em "🗺️ Mapa" em `index.html`)
- **Quando** a página carregar
- **Então** a planta `planta_ps.png` aparece como background
- **E** sobre ela, marcadores dos 17 leitos numerados nas posições configuradas em `map_config.payload`
- **E** cada marcador mostra o número do leito, e (se ocupado) o nome curto do paciente + cor por gravidade

**Cenário 2: alocar paciente em leito clicando no mapa**

- **Dado** um leito vazio
- **Quando** o plantonista clicar no marcador
- **Então** abre painel para selecionar paciente existente OU criar novo
- **E** ao confirmar, o paciente fica visualmente "no leito" no mapa

**Cenário 3: editar posição dos marcadores (admin)**

- **Dado** que o usuário tem `role='coordenador'`
- **Quando** ativar "Modo edição de mapa"
- **Então** pode arrastar marcadores; posições salvam em `map_config.payload` ao soltar
- **Não-coordenadores** não veem o botão de edição

**Cenário 4: leito extra (overflow)**

- **Dado** que há mais pacientes que leitos numerados
- **Quando** o plantonista criar um "Leito Extra"
- **Então** aparece marcador adicional na área `Procedimentos` (default)
- **E** persiste em tabela `leitos` com `kind='extra'`

## Fora do escopo

- Drag-and-drop de paciente entre leitos no mapa (vira spec separada se demanda surgir)
- Animação de transferência inter-hospitalar
- Heatmap histórico de ocupação (analytics, fora do MVP)

## Perguntas em aberto

- [ ] O mapa precisa atualizar em tempo real entre dispositivos (Realtime do Supabase) ou polling de 30s basta? Custo Realtime vs UX.
- [ ] Em telas pequenas (mobile), mapa fica utilizável ou só lista? (testar com Playwright mobile viewport)

## Referências

- `assets/planta_ps.png` — imagem-base
- `js/mapa-retaguarda-app.js` — implementação atual em vanilla JS
- `js/final-app.js:29-53` — array `leitosFixos` original (a migrar para tabela `leitos`)
- Spec relacionada: `0001-passagem-de-plantao.md`
