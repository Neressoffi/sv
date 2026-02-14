# Déploiement simple (3 étapes)

Tu mets le **site** sur **Vercel** et l’**API + base de données** sur **Railway**. Tout se fait depuis le navigateur en connectant ton dépôt GitHub.

---

## Prérequis

- Ton projet est poussé sur **GitHub** (dépôt `sv` ou autre).

---

## Étape 1 : Créer l’API + la base sur Railway

1. Va sur **https://railway.app** et connecte-toi avec **GitHub**.
2. **New Project** → **Deploy from GitHub repo** → choisis ton dépôt (ex. `sv`).
3. Railway crée un premier service. Clique dessus.
4. Dans **Settings** :
   - **Root Directory** : mets **`server`** (obligatoire).
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
5. **Variables** (onglet Variables) : ajoute au minimum :
   - `JWT_SECRET` = une longue chaîne aléatoire (ex. `ma-cle-secrete-123`)
   - `FRONTEND_URL` = tu la mettras à l’étape 2 (URL Vercel)
6. Dans le projet Railway : **+ New** → **Database** → **Add MySQL**.
7. Clique sur la base MySQL → onglet **Data** ou **Connect** : ouvre le **MySQL Console** (ou utilise une app type TablePlus avec les infos de connexion). Exécute les **3 CREATE TABLE** du fichier `database/schema.sql` (sans `CREATE DATABASE` ni `USE`).
8. Dans le service **API** (ton repo), onglet **Variables** : Railway a peut‑être déjà ajouté des variables MySQL. Sinon ajoute-les à la main avec les valeurs affichées dans la base MySQL :
   - `MYSQL_HOST`
   - `MYSQL_PORT` = `3306`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
9. **Deploy** (ou laisse Railway redéployer). Une fois en marche, clique sur le service API → **Settings** → **Networking** → **Generate Domain**. Note l’URL (ex. `https://sv-production-xxx.up.railway.app`).

---

## Étape 2 : Mettre le site en ligne sur Vercel

1. Va sur **https://vercel.com** et connecte-toi avec **GitHub**.
2. **Add New** → **Project** → importe le **même dépôt** (`sv`).
3. **Root Directory** : laisse à la racine.
4. **Environment Variables** : ajoute **une** variable :
   - **Name** : `VITE_API_URL`
   - **Value** : l’URL Railway de l’étape 1 (ex. `https://sv-production-xxx.up.railway.app`)
5. Clique sur **Deploy**. À la fin, note l’URL du site (ex. `https://sv-xxx.vercel.app`).

---

## Étape 3 : Relier les deux

1. **Railway** : dans le service API, **Variables** → édite **`FRONTEND_URL`** et mets l’URL Vercel (ex. `https://sv-xxx.vercel.app`). Sauvegarde (Railway redéploie si besoin).
2. **Vercel** : si tu n’avais pas encore mis `VITE_API_URL` au déploiement, ajoute-la (Settings → Environment Variables) puis **Redeploy** le projet.

---

## C’est tout

- **Site** : `https://ton-projet.vercel.app`
- **API** : `https://ton-api.up.railway.app`

Tu peux partager le lien Vercel pour accéder à l’app. L’API et la base tournent sur Railway.
