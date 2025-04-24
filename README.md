# SSO System with Firebase Auth

This repository contains a Single Sign-On (SSO) system with two client applications that share authentication state. The system uses Firebase for email and Google authentication.

## Components

- SSO Server: Node.js Express server with JWT authentication
- Calculator App: React-based calculator application
- Notes App: React-based note-taking application
- Redis: For session storage

## Prerequisites

- Node.js v14+ and npm
- Docker and Docker Compose
- Firebase account and project

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sso-system.git
   cd sso-system
   ```

2. Create Firebase project and set up Authentication:
   - Enable Email/Password and Google sign-in methods
   - Create a service account key and save as `sso-server/firebase-service-account.json`

3. Configure environment variables:
   - Create `.env` files in each directory using the templates provided

4. Build and run the Docker containers:
   ```
   export JWT_SECRET=$(openssl rand -base64 32)
   export COOKIE_SECRET=$(openssl rand -base64 32)
   docker-compose up --build
   ```

5. Access the applications:
   - Calculator App: http://localhost:3001
   - Notes App: http://localhost:3002
   - SSO Server API: http://localhost:4000

## Features

- Single Sign-On with Firebase Authentication
- Shared authentication state between applications
- Secure JWT-based authentication
- Email/Password and Google login options
- Automatic token refresh