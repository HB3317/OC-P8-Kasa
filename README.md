# Kasa

## Description du projet

Kasa est une application web de consultation et de gestion de logements, développée avec **Next.js, React et TypeScript** pour le frontend, et **Express et SQLite** pour le backend. Elle permet de consulter les annonces et leurs photos, de créer un compte, de se connecter, d'enregistrer des favoris, de publier des logements et d'échanger des messages. Un email de confirmation est envoyé après l'inscription lorsque Resend est configuré.

## Prérequis pour l'installation

- **Node.js 20.9 ou version ultérieure** et **npm**.
- **Git** pour récupérer le dépôt.

## Installation

Cloner le dépôt et installer les dépendances des deux applications :

```bash
git clone https://github.com/HB3317/OC-P8-Kasa.git
cd OC-P8-Kasa
cd backend && npm install
cd ../frontend && npm install
```

Pour tester l'envoi des emails d'inscription, créer `frontend/.env.local` et y renseigner les variables suivantes avec une clé API Resend personnelle :

```dotenv
RESEND_API_KEY=cle_api_resend
RESEND_FROM_EMAIL="Kasa <onboarding@resend.dev>"
```

Sans configuration Resend, l'inscription reste possible mais aucun email n'est envoyé. Le fichier `.env.local` ne doit pas être commité.

## Lancement du projet

Dans **deux terminaux distincts**, depuis le dossier du dépôt :

**Backend — port 3000**

```bash
cd backend
npm start
```

**Frontend — port 3001 (développement)**

```bash
cd frontend
npm run dev -- -p 3001
```

Ouvrir **http://localhost:3001** dans le navigateur. Pour lancer la version de production locale du frontend, exécuter `npm run build`, puis `npm start` dans `frontend` (le script `start` du projet est configuré pour le port 3001).
