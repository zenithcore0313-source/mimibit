#!/usr/bin/env bash
# =====================================================================
# MIMIBIT Automated EC2 (Ubuntu) Setup Script
# Installs Node.js 20 LTS, Nginx, PM2, Certbot, and Configures Firewall
# =====================================================================

set -e

echo "🚀 [MIMIBIT] Starting EC2 Production Environment Setup..."

# 1. Update OS Packages
echo "📦 Updating OS package lists..."
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20 LTS & Build Essentials
echo "🟢 Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx git certbot python3-certbot-nginx

# 3. Install PM2 Globally
echo "⚡ Installing PM2 Process Manager..."
sudo npm install -g pm2

# 4. Create App Directory
sudo mkdir -p /home/ubuntu/mimibit
sudo chown -R ubuntu:ubuntu /home/ubuntu/mimibit

echo "✅ Environment Setup Completed!"
echo "Node Version: $(node -v)"
echo "NPM Version:  $(npm -v)"
echo "PM2 Version:  $(pm2 -v)"
echo "Nginx Status: $(sudo systemctl is-active nginx)"
