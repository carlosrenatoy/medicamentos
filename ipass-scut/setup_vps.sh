#!/bin/bash

# Script de Configuração Automática da VPS (Ubuntu/Debian)
# Execute este script dentro da sua VPS para instalar o servidor web.

echo "==========================================="
echo "   Iniciando Configuração do Servidor Web  "
echo "==========================================="

# 1. Atualizar lista de pacotes
echo "[1/4] Atualizando o sistema..."
apt update && apt upgrade -y

# 2. Instalar Nginx
echo "[2/4] Instalando Nginx..."
apt install nginx -y

# 3. Configurar Firewall
echo "[3/4] Configurando Firewall..."
ufw allow 'Nginx Full'
ufw allow OpenSSH
ufw enable

# 4. Verificar Status
echo "[4/4] Verificando status..."
systemctl status nginx --no-pager

echo "==========================================="
echo "   INSTALAÇÃO CONCLUÍDA COM SUCESSO! 🚀    "
echo "==========================================="
echo "Seu servidor web está rodando."
echo "Agora você pode enviar os arquivos do seu site (pasta 'dist') para /var/www/html/"
