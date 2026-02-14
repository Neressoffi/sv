# Vérification GitHub Pages

Après avoir poussé le code, vérifie ceci :

## 1. Le workflow a bien tourné

- Va dans ton dépôt → onglet **Actions**.
- Tu dois voir un workflow **"Deploy on GitHub Pages"** (ou le nom du fichier).
- Clique dessus : il doit être **vert** (succès). Si **rouge**, ouvre le job et regarde l’erreur (souvent `npm ci` ou une variable manquante).

## 2. Variable VITE_API_URL (optionnel mais recommandé)

- **Settings** → **Secrets and variables** → **Actions** → onglet **Variables**.
- Ajoute **VITE_API_URL** = l’URL de ton API (ex. Render ou Railway), sinon l’app ne pourra pas appeler l’API en ligne.

## 3. Environnement GitHub Pages

- **Settings** → **Pages**.
- En bas, section **Environments** : il doit y avoir **github-pages**. Si tu as une erreur du type "Environment not found", GitHub le crée au premier déploiement réussi.

## 4. Ouvrir le site

- Une fois le workflow vert : **https://neressoffi.github.io/sv/**
- Si tu vois une page blanche : ouvre la console (F12) et regarde les erreurs (souvent 404 sur `/sv/assets/...` ou erreur de chargement).

## 5. Si le workflow échoue

- **npm ci** en erreur : vérifie que `package-lock.json` est bien commité à la racine.
- **Build** en erreur : vérifie le message (souvent une dépendance ou une variable d’environnement).
- **Deploy** en erreur : vérifie que la source Pages est bien **GitHub Actions**.
