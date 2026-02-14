# ❤️ Souvenirs à Deux

Application mobile-first pour couples : partagez des **photos souvenirs** et des **quiz** avec votre partenaire. Backend **MySQL** + API Node.js.

## Fonctionnalités

- **Partie Souvenirs** : galerie de vos photos (créées par vous ou reçues).
- **Ajout de souvenir** : upload d’une photo + questions pour votre partenaire.
- **Quiz** : la partenaire voit la photo et répond aux questions.
- **Vérification** : vous voyez ses réponses et vous pouvez les valider.

## Prérequis

- Node.js 18+
- **MySQL** (installé localement ou serveur distant)

## Installation

### 1. Base de données MySQL

Créez la base et les tables avec le script fourni :

```bash
mysql -u root -p < database/schema.sql
```

(Sous Windows, depuis le dossier du projet : `mysql -u root -p < database\schema.sql`)

Ou dans **phpMyAdmin** : onglet SQL → coller le contenu de `database/schema.sql` → Exécuter.

Cela crée la base `souvenirs_a_deux` et les tables `users`, `souvenirs`, `souvenir_answers`.

### 2. Backend (API Node.js)

```bash
cd server
cp .env.example .env
```

Éditez `server/.env` et remplissez :

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=votre_mot_de_passe
MYSQL_DATABASE=souvenirs_a_deux

JWT_SECRET=une-longue-chaine-aleatoire-secrete

PORT=3001
```

Puis :

```bash
cd server
npm install
npm run dev
```

L’API tourne sur **http://localhost:3001**.

### 3. Frontend (React)

À la **racine** du projet (dossier `sv`) :

```bash
npm install
npm run dev
```

Ouvrez **http://localhost:5173**. En développement, le frontend envoie les requêtes vers l’API via un proxy (pas besoin de configurer `VITE_API_URL`).

### 4. En production

- Build frontend : `npm run build` → dossier `dist`.
- Déployer le dossier `dist` (Vercel, Netlify, etc.).
- Déployer le serveur `server` (Railway, Render, VPS, etc.) avec une base MySQL.
- Dans le frontend déployé, définir la variable d’environnement **`VITE_API_URL`** = URL de votre API (ex. `https://votre-api.railway.app`).

## Structure du projet

```
sv/
  database/
    schema.sql      Script de création de la BDD MySQL
    README.md
  server/           API Express + MySQL
    index.js
    db.js
    routes/         auth, users, souvenirs
    uploads/        Photos envoyées (créé à l’usage)
  src/
    api/            Client API (auth, souvenirs, client)
    context/        AuthContext (JWT)
    lib/            souvenirs.js (appels API)
    pages/          Login, Register, Home, Profile, Souvenirs, etc.
```

## Licence

Projet à usage personnel / éducatif.
