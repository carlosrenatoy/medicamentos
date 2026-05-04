# Dependências, package.json e package-lock.json

## O que é `package.json`

O `package.json` é o arquivo principal do projeto Node/React. Ele define:

- nome do projeto;
- versão;
- comandos disponíveis;
- dependências de produção;
- dependências de desenvolvimento;
- versão mínima do Node.js.

No PediDose, o comando principal de verificação é:

```bash
npm run verify
```

Esse comando executa:

```bash
npm run lint && npm run test:clinical && npm run build
```

## O que é `package-lock.json`

O `package-lock.json` trava as versões exatas instaladas pelo npm.

Ele é importante para reprodutibilidade, principalmente em CI/CD e produção.

## Situação atual

Este repositório ainda não tem `package-lock.json` commitado.

Por isso, o GitHub Actions usa:

```bash
npm install
```

Se o lockfile for adicionado depois, o workflow pode voltar a usar:

```bash
npm ci
```

## Como gerar corretamente

No ambiente local ou Codespace, rodar:

```bash
npm install
npm run verify
```

Depois commitar o arquivo gerado:

```bash
git add package-lock.json
git commit -m "chore: add npm lockfile"
git push
```

## O que não fazer

Não criar o `package-lock.json` manualmente.

O lockfile deve ser gerado pelo npm para garantir resolução correta das dependências.

## Regra recomendada

Enquanto não houver lockfile:

```bash
npm install
npm run verify
```

Depois que houver lockfile:

```bash
npm ci
npm run verify
```
