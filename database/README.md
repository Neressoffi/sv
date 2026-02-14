# Base de données MySQL – Souvenirs à Deux

## 1. Créer la base et les tables

Ouvrez MySQL (ligne de commande, phpMyAdmin, MySQL Workbench, etc.) et exécutez le fichier `schema.sql` :

**Ligne de commande :**
```bash
mysql -u root -p < schema.sql
```
(ou depuis le dossier `database` : `mysql -u root -p < database/schema.sql`)

**Dans phpMyAdmin :** Onglet « SQL », collez le contenu de `schema.sql` puis Exécuter.

Cela crée :
- La base `souvenirs_a_deux`
- Les tables : `users`, `souvenirs`, `souvenir_answers`

## 2. Configurer le serveur API

Dans le dossier `server`, copiez `.env.example` en `.env` et remplissez :

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=votre_mot_de_passe_mysql
MYSQL_DATABASE=souvenirs_a_deux

JWT_SECRET=une-longue-chaine-aleatoire-secrete

PORT=3001
```

## 3. Démarrer le serveur

```bash
cd server
npm install
npm run dev
```

L’API tourne sur http://localhost:3001. Le frontend (Vite) fait les appels vers cette API (en dev via le proxy).
