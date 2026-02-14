# Déployer le site sur GitHub Pages

Le site (frontend) sera accessible à : **https://neressoffi.github.io/sv/**

L’**API** (backend) doit être hébergée ailleurs (ex. Render) — GitHub Pages ne fait qu’héberger des fichiers statiques.

---

## 1. Corriger l’erreur « Custom domain »

- Va dans ton dépôt : **Settings** → **Pages** (menu de gauche).
- Dans **Custom domain**, tu as peut‑être mis `sv`, ce qui provoque l’erreur.
- **Enlève** tout ce qui est écrit dans **Custom domain** (laisse le champ vide) puis **Save**.
- Un domaine personnalisé doit être du type `www.mondomaine.com`, pas `sv`.

Ton site utilisera l’URL par défaut : **https://neressoffi.github.io/sv/**.

---

## 2. Variable d’environnement pour l’API

Le front a besoin de l’URL de ton API au moment du build.

1. Dans le dépôt : **Settings** → **Secrets and variables** → **Actions**.
2. Onglet **Variables** → **New repository variable**.
3. **Name** : `VITE_API_URL`
4. **Value** : l’URL de ton API (ex. `https://souvenirs-api-xxx.onrender.com`).
   - Si tu n’as pas encore déployé l’API sur Render, mets une URL temporaire (ex. `https://souvenirs-api-xxx.onrender.com`) ; tu pourras la modifier plus tard et relancer le déploiement.

Sans cette variable, l’app ne pourra pas appeler l’API en production.

---

## 3. Activer GitHub Pages

1. **Settings** → **Pages**.
2. **Build and deployment** :
   - **Source** : **Deploy from a branch** (pas « GitHub Actions »).
   - **Branch** : `gh-pages` (le workflow pousse le build sur cette branche).
   - **Folder** : `/ (root)`.
3. Enregistre si besoin.

---

## 4. Pousser le code

Quand tu pushes sur la branche `main`, le workflow **Deploy on GitHub Pages** se lance : il installe les dépendances, build avec `VITE_API_URL`, puis déploie le contenu de `dist` sur GitHub Pages.

```bash
git add .
git commit -m "Configure GitHub Pages"
git push origin main
```

---

## 5. Vérifier

- Onglet **Actions** : le workflow doit passer en vert.
- Ensuite ouvre **https://neressoffi.github.io/sv/** : le site doit s’afficher.

**Important** : l’API doit être en ligne (ex. sur Render) et `FRONTEND_URL` côté API doit être `https://neressoffi.github.io/sv` pour que tout fonctionne (cookies, CORS, etc.).
