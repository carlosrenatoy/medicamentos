# Guia Completo de Deploy em VPS (Servidor Linux) 🚀

Este guia aborda como publicar o **IPASS SCUT** em um servidor privado virtual (VPS) usando **Nginx** como servidor web, configurando um **domínio personalizado** e ativando **HTTPS (SSL)** gratuito com Let's Encrypt.

---

## 📋 Pré-requisitos

1.  **Servidor VPS**: Uma máquina Linux (recomendamos **Ubuntu 22.04 LTS**).
    - _Provedores sugeridos_: DigitalOcean, AWS (Lightsail), Hetzner ou Vultr.
2.  **Domínio**: Um endereço web comprado (ex: `scut-ipass.com`).
    - _Registradores_: GoDaddy, Registro.br, Namecheap.
3.  **Acesso SSH**: Terminal para acessar o servidor.

---

## 📦 Passo 1: Preparar os Arquivos (No seu Computador)

Para facilitar, criei um script automático na pasta do projeto.

1.  Dê dois cliques no arquivo **`criar_pacote_deploy.bat`**.
2.  Ele criará uma pasta chamada **`dist`**.
3.  O conteúdo dessa pasta é o que iremos enviar para o servidor.

---

## 🖥️ Passo 2: Configurar a VPS (No Servidor)

Acesse seu servidor via SSH (use o PowerShell ou Terminal):
`ssh root@seuservidor_ip`

### 2.1. Atualizar o Sistema e Instalar Nginx

Execute os comandos abaixo:

```bash
# Atualiza lista de pacotes
sudo apt update && sudo apt upgrade -y

# Instala o servidor web Nginx
sudo apt install nginx -y

# Verifica se está rodando
systemctl status nginx
```

_Se aparecer "active (running)", deu certo. Aperte `q` para sair._

### 2.2. Configurar Firewall

```bash
# Permite tráfego Web (HTTP e HTTPS) e SSH
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

## 🌐 Passo 3: Configurar DNS do Domínio

Vá no painel onde você comprou seu domínio (ex: Registro.br) e edite a **Zona DNS**.

1.  Crie um registro **Tipo A**.
2.  **Nome/Host**: `@` (ou o subdomínio que desejar, ex: `app`).
3.  **Valor/Destino**: O **Endereço IP** da sua VPS.
4.  Salve. (A propagação pode levar de 10 minutos a 24h).

---

## 📂 Passo 4: Enviar Arquivos para o Servidor

Agora vamos enviar a pasta `dist` do seu computador para a VPS. Você pode usar um programa como **FileZilla** ou o comando **SCP**.

**Usando SCP (No PowerShell do seu computador):**
_(Substitua `root@ip` pelos dados reais)_

```powershell
# Estando na pasta do projeto:
scp -r dist/* root@SEU_IP_VPS:/var/www/html/
```

Isso colocará os arquivos do site na pasta padrão do Nginx.

---

## 🔒 Passo 5: Configurar HTTPS (SSL Gratuito)

Vamos usar o **Certbot** para instalar um certificado SSL automático.

### 5.1. Instalar Certbot

(Ainda no terminal da VPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2. Configurar Nginx para seu Domínio

Edite o arquivo padrão (ou crie um novo):

```bash
nano /etc/nginx/sites-available/default
```

Procure a linha `server_name _;` e mude para seu domínio:

```nginx
server_name seusite.com www.seusite.com;
```

_Aperte `Ctrl+O` para salvar e `Ctrl+X` para sair._

Teste a configuração e reinicie o Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 5.3. Gerar o Certificado

```bash
sudo certbot --nginx -d seusite.com -d www.seusite.com
```

1.  Ele pedirá um e-mail (para avisos de renovação).
2.  Concorde com os termos (`Y`).
3.  Pronto! O Certbot configurará o SSL e a renovação automática.

---

## ✅ Conclusão

Acesse **`https://seusite.com`** no navegador.

Seu aplicativo **IPASS SCUT** deve estar rodando seguro com cadeado verde! 🔒

### Lembretes Importantes:

- **Dados Locais**: Assim como na versão local, os dados dos pacientes ficam salvos no **Navegador do Usuário**. A VPS apenas entrega o código do site. Se você limpar o cache do navegador, perde os dados.
- **API Key**: Cada usuário (ou navegador) precisará inserir a chave da API Gemini novamente na primeira vez.

---

### Solução de Problemas Comuns

**Erro 404 ou Página Padrão do Nginx?**
Verifique se os arquivos estão na pasta certa:
`ls -la /var/www/html/`
Deve ter um `index.html`. Se tiver `index-final.html`, renomeie para `index.html`.

**Permissões de Arquivo:**
Se der "Forbidden", corrija as permissões:

```bash
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html
```
