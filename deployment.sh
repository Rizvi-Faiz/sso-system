# deployment.sh
#!/bin/bash

# Set up environment variables
export JWT_SECRET=$(openssl rand -base64 32)
export COOKIE_SECRET=$(openssl rand -base64 32)

# Build Docker images
docker-compose build

# Tag Docker images
docker tag sso-system_sso-server:latest yourusername/sso-server:latest
docker tag sso-system_calculator-app:latest yourusername/calculator-app:latest
docker tag sso-system_notes-app:latest yourusername/notes-app:latest

# Push Docker images
docker push yourusername/sso-server:latest
docker push yourusername/calculator-app:latest
docker push yourusername/notes-app:latest

# GitHub repository setup
# First time setup
# git init
# git add .
# git commit -m "Initial commit"
# git branch -M main
# git remote add origin https://github.com/yourusername/sso-system.git
# git push -u origin main

# Subsequent updates
git add .
git commit -m "Update SSO system"
git push origin main
