# Mettre Souvenirs à Deux en ligne

Tu vas déployer :
- **le site** (frontend) sur **Vercel** (gratuit)
- **l’API** (backend) sur **Render** (gratuit)
- **la base MySQL** sur **PlanetScale** (gratuit)

À la fin, ton app sera accessible via une URL du type `https://sv-xxx.vercel.app`.

---

## Étape 0 : Pousser le projet sur GitHub

1. Crée un compte sur **https://github.com** si besoin.
2. Crée un **nouveau dépôt** (New repository), nomme-le par ex. `souvenirs-a-deux`, ne coche pas « Initialize with README ».
3. Sur ton PC, ouvre un terminal dans le dossier du projet (`sv`) et exécute :

```bash
cd C:\Users\Ariel Ngoualem Pro\Desktop\sv
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON-PSEUDO/souvenirs-a-deux.git
git push -u origin main
```

Remplace `TON-PSEUDO` par ton pseudo GitHub. Si un fichier `.env` est ajouté par erreur, supprime-le du suivi (`git rm --cached server/.env`) avant de commit — le `.env` ne doit **pas** être sur GitHub.

---

## Étape 1 : Base de données MySQL (PlanetScale)

1. Va sur **https://planetscale.com** et crée un compte (gratuit).
2. **Create database** → nom : `souvenirs-a-deux` → région proche de toi → Create.
3. Une fois la base créée, clique sur **Connect** → **Connect with: General**.
4. Choisis **Node.js** et note les infos (elles ressemblent à) :
   - **Host** : `xxx.aws.connect.psdb.cloud`
   - **Username** : `xxx`
   - **Password** : (clique sur **Generate password** et copie-le)
   - **Database** : `souvenirs-a-deux`
5. Dans PlanetScale : onglet **Console** → **SQL**. La base existe déjà. Exécute **uniquement** les 3 blocs `CREATE TABLE` (users, souvenirs, souvenir_answers) du fichier `database/schema.sql`, **sans** les lignes `CREATE DATABASE` et `USE souvenirs_a_deux`.

Garde **Host**, **Username**, **Password** et **Database** pour l’étape 3 (Render).

---

## Étape 2 : Mettre le site en ligne (Vercel)

1. Va sur **https://vercel.com** et connecte-toi avec GitHub.
2. **Add New** → **Project** → importe le dépôt **souvenirs-a-deux**.
3. **Root Directory** : laisse à la racine (`.`).
4. **Build Command** : `npm run build` (souvent déjà rempli).
5. **Output Directory** : `dist`.
6. Dans **Environment Variables**, ajoute **une** variable :
   - **Name** : `VITE_API_URL`
   - **Value** : tu la mettras à l’étape 3 après avoir créé l’API sur Render (ex. `https://souvenirs-api-xxx.onrender.com`). Tu pourras la modifier plus tard dans Vercel → Settings → Environment Variables.
7. Clique sur **Deploy**. À la fin, tu auras une URL du type `https://souvenirs-a-deux-xxx.vercel.app`. Note-la.

---

## Étape 3 : Mettre l’API en ligne (Render)

1. Va sur **https://render.com** et connecte-toi avec GitHub.
2. **New +** → **Web Service**.
3. Connecte le même dépôt **souvenirs-a-deux**.
4. **Root Directory** : indique **`server`** (important).
5. **Runtime** : Node.
6. **Build Command** : `npm install`
7. **Start Command** : `npm start`
8. **Plan** : Free.

Dans **Environment** (variables d’environnement), ajoute **toutes** les variables suivantes (remplace les valeurs par les tiennes) :

| Key | Value |
|-----|--------|
| `MYSQL_HOST` | (Host PlanetScale, ex. `xxx.aws.connect.psdb.cloud`) |
| `MYSQL_PORT` | `3306` |
| `MYSQL_USER` | (Username PlanetScale) |
| `MYSQL_PASSWORD` | (Password PlanetScale) |
| `MYSQL_DATABASE` | `souvenirs-a-deux` |
| `JWT_SECRET` | (une longue chaîne aléatoire, comme en local) |
| `PORT` | `3001` (Render l’ignore et utilise le sien, mais on le met par défaut) |
| `FRONTEND_URL` | **URL Vercel** (ex. `https://souvenirs-a-deux-xxx.vercel.app`) |
| `APP_NAME` | `Souvenirs à Deux` |

Optionnel (pour les emails par Gmail) :

| Key | Value |
|-----|--------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | ton@gmail.com |
| `SMTP_PASSWORD` | mot de passe d’application Gmail |
| `EMAIL_FROM` | ton@gmail.com |

9. Clique sur **Create Web Service**. Render va builder et démarrer l’API. Une fois en marche, l’URL sera du type **`https://souvenirs-api-xxx.onrender.com`**.
10. **Retourne sur Vercel** : dans ton projet → **Settings** → **Environment Variables** → édite `VITE_API_URL` et mets **exactement** l’URL de Render (ex. `https://souvenirs-api-xxx.onrender.com`). Puis **Redeploy** le projet (Deployments → ⋮ → Redeploy).

---

## Étape 4 : Vérifier

1. Ouvre l’URL **Vercel** (ton site).
2. Inscris-toi, connecte-toi, ajoute l’email de ta partenaire, crée un souvenir.
3. Sur téléphone ou en navigation privée, ouvre le **même lien Vercel** et connecte-toi avec l’email de la partenaire : tu dois voir le quiz dans Souvenirs.

---

## En résumé

| Quoi | Où | URL type |
|------|----|----------|
| Site (frontend) | Vercel | `https://souvenirs-a-deux-xxx.vercel.app` |
| API (backend) | Render | `https://souvenirs-api-xxx.onrender.com` |
| Base MySQL | PlanetScale | (utilisée uniquement par l’API) |

**Important** : Sur le plan gratuit, Render met le service en veille après ~15 min sans visite. La première requête après ça peut prendre 30–60 secondes, puis tout redevient normal.
