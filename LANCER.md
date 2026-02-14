# Comment lancer le projet Souvenirs à Deux

## Étape 1 : Créer la base de données MySQL

Ouvre MySQL (ligne de commande ou phpMyAdmin) et exécute le script :

**Ligne de commande Windows (PowerShell ou CMD) :**
```bash
cd C:\Users\Ariel Ngoualem Pro\Desktop\sv
mysql -u root -p < database\schema.sql
```
(Entre ton mot de passe MySQL quand il est demandé.)

**Avec phpMyAdmin :**
1. Ouvre phpMyAdmin dans ton navigateur.
2. Onglet **SQL**.
3. Copie tout le contenu du fichier `database/schema.sql`.
4. Colle dans la zone de texte et clique **Exécuter**.

---

## Étape 2 : Configurer le serveur (backend)

1. Dans le dossier du projet, va dans `server` et copie le fichier d’exemple :
   - Copie `server/.env.example` en `server/.env`

2. Ouvre `server/.env` et remplis au minimum :
   - **MYSQL_PASSWORD** = ton mot de passe MySQL (souvent vide pour `root` en local : laisse vide ou mets ton mot de passe).
   - **JWT_SECRET** = une longue phrase secrète quelconque (ex. : `ma-cle-secrete-souvenirs-2025`).

Exemple de `server/.env` :
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=souvenirs_a_deux

JWT_SECRET=ma-cle-secrete-souvenirs-2025

PORT=3001
```

3. Installe les dépendances du serveur et lance l’API :

```bash
cd server
npm install
npm run dev
```

Tu dois voir : **API Souvenirs à Deux sur http://localhost:3001**  
Garde cette fenêtre ouverte.

---

## Étape 3 : Lancer le frontend (l’application dans le navigateur)

Ouvre **un autre terminal** (sans fermer le serveur), va à la racine du projet et lance le frontend :

```bash
cd C:\Users\Ariel Ngoualem Pro\Desktop\sv
npm install
npm run dev
```

Tu dois voir une URL du type : **http://localhost:5173**

Ouvre cette URL dans ton navigateur. L’application est prête.

---

## Résumé des commandes (dans l’ordre)

| Ordre | Où | Commande |
|-------|-----|----------|
| 1 | MySQL | Exécuter `database/schema.sql` (une seule fois) |
| 2 | `server/` | Créer `server/.env` à partir de `.env.example` et le remplir |
| 3 | `server/` | `npm install` puis `npm run dev` (laisser tourner) |
| 4 | Racine `sv/` | `npm install` puis `npm run dev` |
| 5 | Navigateur | Ouvrir **http://localhost:5173** |

---

## En cas de problème

- **« Cannot find module »** dans `server` : refais `cd server` puis `npm install`.
- **Erreur de connexion MySQL** : vérifie que MySQL est démarré et que `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_DATABASE` dans `server/.env` sont corrects.
- **Page blanche ou erreur réseau** : assure-toi que le serveur tourne bien sur le port 3001 (`npm run dev` dans `server/`).

---

## Envoyer l’email d’invitation à ta partenaire

Quand tu enregistres l’email de ta partenaire dans **Profil**, l’app lui envoie un mail avec un lien vers l’app. **Deux méthodes possibles** (une seule suffit).

### Méthode recommandée : Resend (simple et fiable)

1. Va sur **https://resend.com** et crée un compte (gratuit).
2. Dans le dashboard : **API Keys** → **Create API Key** → copie la clé (elle commence par `re_`).
3. Dans `server/.env`, ajoute :
   ```env
   RESEND_API_KEY=re_ta_cle_copiee
   EMAIL_FROM=onboarding@resend.dev
   FRONTEND_URL=http://localhost:5173
   ```
   (`onboarding@resend.dev` est autorisé pour les tests sans vérifier de domaine.)
4. Redémarre le serveur (`Ctrl+C` puis `npm run dev` dans `server/`).
5. Dans l’app : **Profil** → saisis l’email de ta partenaire → **Enregistrer**. L’email part à chaque enregistrement.

### Alternative : Gmail (SMTP)

Dans `server/.env`, mets **SMTP_HOST**, **SMTP_USER**, **SMTP_PASSWORD** (mot de passe d’application Gmail, pas ton mot de passe compte). Voir `server/.env.example`. Ne mets pas **RESEND_API_KEY** si tu utilises Gmail.

Sans aucune config email, le profil est quand même enregistré ; seul l’envoi du mail est désactivé.
