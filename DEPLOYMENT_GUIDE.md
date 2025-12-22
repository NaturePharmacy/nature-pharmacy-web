# 🚀 Guide de Déploiement - Nature Pharmacy sur Bluehost

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir:
- ✅ Un compte Bluehost avec Node.js activé
- ✅ Accès SSH à votre serveur Bluehost
- ✅ Un compte MongoDB Atlas (gratuit)
- ✅ Les fichiers du projet Nature Pharmacy

---

## 🗄️ Étape 1: Configuration de MongoDB Atlas

### 1.1 Créer un Cluster MongoDB Atlas (si pas déjà fait)

1. Allez sur [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit ou connectez-vous
3. Créez un nouveau cluster (Free Tier M0 - Gratuit)
4. Choisissez une région proche de vos utilisateurs (Europe pour la France/Afrique)
5. Attendez 5-10 minutes que le cluster se crée

### 1.2 Configurer l'Accès Réseau

1. Dans MongoDB Atlas, allez dans **Network Access** (dans le menu de gauche)
2. Cliquez sur **Add IP Address**
3. Sélectionnez **Allow Access from Anywhere** (0.0.0.0/0)
   - ⚠️ Ceci est nécessaire car l'IP de Bluehost peut changer
4. Cliquez sur **Confirm**

### 1.3 Créer un Utilisateur de Base de Données

1. Allez dans **Database Access**
2. Cliquez sur **Add New Database User**
3. Créez un utilisateur:
   - **Username**: `naturepharmacy` (ou votre choix)
   - **Password**: Générez un mot de passe fort (SAUVEGARDEZ-LE!)
   - **Database User Privileges**: Read and write to any database
4. Cliquez sur **Add User**

### 1.4 Obtenir la Chaîne de Connexion

1. Retournez dans **Database** (dans le menu de gauche)
2. Cliquez sur **Connect** sur votre cluster
3. Sélectionnez **Connect your application**
4. Copiez la chaîne de connexion (elle ressemble à):
   ```
   mongodb+srv://naturepharmacy:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Remplacez `<password>` par le mot de passe que vous avez créé
6. Ajoutez le nom de votre base de données avant les paramètres:
   ```
   mongodb+srv://naturepharmacy:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/nature-pharmacy?retryWrites=true&w=majority
   ```

---

## 🔐 Étape 2: Créer NextAuth Secret

Générez un secret sécurisé pour NextAuth:

```bash
# Sur votre ordinateur local, exécutez:
openssl rand -base64 32
```

Ou utilisez ce site: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

Sauvegardez cette valeur, vous en aurez besoin.

---

## 📦 Étape 3: Préparer le Projet pour la Production

### 3.1 Créer le fichier .env.production

Sur votre ordinateur local, créez un fichier `.env.production` à la racine du projet:

```env
# MongoDB
MONGODB_URI=mongodb+srv://naturepharmacy:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/nature-pharmacy?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=VOTRE_SECRET_GENERE_AVEC_OPENSSL
NEXTAUTH_URL=https://votre-domaine.com

# Site Password Protection (optionnel - pour accès client uniquement)
SITE_PASSWORD=clientpreview2024
```

### 3.2 Construire le Projet

```bash
cd "c:\Users\pc\Nature Pharmacy\nature-pharmacy"
npm run build
```

Cette commande va créer un dossier `.next` avec tous les fichiers optimisés.

---

## 🌐 Étape 4: Uploader sur Bluehost

### 4.1 Se Connecter via SSH

```bash
ssh username@votre-domaine.com
```

Ou utilisez l'outil SSH de Bluehost dans cPanel.

### 4.2 Installer Node.js sur Bluehost

1. Connectez-vous à votre **cPanel Bluehost**
2. Cherchez **Setup Node.js App**
3. Créez une nouvelle application:
   - **Node.js version**: Choisissez la version 18.x ou supérieure
   - **Application mode**: Production
   - **Application root**: `nature-pharmacy` (ou votre choix)
   - **Application URL**: Votre domaine ou sous-domaine
   - **Application startup file**: `server.js`

### 4.3 Uploader les Fichiers

Option A: Via FTP (FileZilla, WinSCP, etc.)
1. Connectez-vous via FTP à votre compte Bluehost
2. Naviguez vers le dossier `nature-pharmacy` (ou celui que vous avez créé)
3. Uploadez TOUS les fichiers du projet SAUF:
   - `node_modules/` (ne pas uploader)
   - `.next/` (ne pas uploader maintenant, sera reconstruit)
   - `.git/` (optionnel)
   - `img/` (optionnel si déjà dans public/)

Option B: Via SSH et Git
```bash
cd ~/nature-pharmacy
git clone https://github.com/Magnetiksn2025/nature-pharmacy.git .
```

### 4.4 Créer le fichier .env.production sur le serveur

Via SSH:
```bash
cd ~/nature-pharmacy
nano .env.production
```

Collez le contenu de votre `.env.production` local, puis:
- Ctrl+O pour sauvegarder
- Entrée pour confirmer
- Ctrl+X pour quitter

### 4.5 Installer les Dépendances

```bash
cd ~/nature-pharmacy
npm install --production
```

### 4.6 Construire le Projet sur le Serveur

```bash
npm run build
```

---

## 🔒 Étape 5: Protection par Mot de Passe (Accès Client Uniquement)

Pour que seul votre client puisse voir le site, un système de protection par mot de passe a été implémenté.

### 5.1 Comment ça fonctionne

Le système de protection comprend trois composants:

1. **Middleware** (`middleware.ts`):
   - Vérifie si la variable `SITE_PASSWORD` est définie dans `.env.production`
   - Si définie, redirige tous les visiteurs vers `/client-access` jusqu'à authentification
   - Permet l'accès après vérification du mot de passe

2. **Page de Login** (`app/[locale]/client-access/page.tsx`):
   - Affiche un formulaire de mot de passe élégant
   - Disponible en français, anglais et espagnol
   - Interface moderne avec validation en temps réel

3. **API de Vérification** (`app/api/auth/client-verify/route.ts`):
   - Vérifie le mot de passe saisi
   - Crée un cookie de session sécurisé (valide 7 jours)
   - Permet la navigation libre pendant 7 jours après authentification

### 5.2 Configuration

Dans votre fichier `.env.production`, assurez-vous d'avoir:

```env
SITE_PASSWORD=votre-mot-de-passe-ici
```

**Recommandations**:
- Utilisez un mot de passe simple à partager avec votre client (ex: `clientpreview2024`)
- Le mot de passe est temporaire, uniquement pour la phase de validation
- Une fois validé par le client, vous pouvez supprimer cette variable pour ouvrir le site

### 5.3 Désactiver la Protection

Pour désactiver la protection par mot de passe (après validation client):
1. Supprimez ou commentez `SITE_PASSWORD` dans `.env.production`
2. Redémarrez l'application
3. Le site devient accessible publiquement

---

## 🚀 Étape 6: Démarrer l'Application

### 6.1 Via cPanel Node.js App Manager

1. Retournez dans **Setup Node.js App** dans cPanel
2. Cliquez sur votre application
3. Cliquez sur **Restart** pour démarrer l'application

### 6.2 Via SSH (Alternative)

```bash
cd ~/nature-pharmacy
npm run start
```

---

## ✅ Étape 7: Vérification

### 7.1 Accéder au Site

1. Ouvrez votre navigateur
2. Allez sur `https://votre-domaine.com`
3. Vous devriez voir la page de protection par mot de passe
4. Entrez le mot de passe: `clientpreview2024`
5. Vous accédez maintenant au site complet!

### 7.2 Donner l'Accès au Client

Envoyez au client:
```
URL: https://votre-domaine.com
Mot de passe: clientpreview2024

Le mot de passe est valide pendant 24 heures.
```

---

## 🔧 Dépannage

### Erreur: "Cannot connect to MongoDB"

**Solution**:
1. Vérifiez que votre `MONGODB_URI` est correct dans `.env.production`
2. Vérifiez que l'IP 0.0.0.0/0 est autorisée dans MongoDB Atlas Network Access
3. Vérifiez que l'utilisateur de base de données existe dans MongoDB Atlas

### Erreur: "NextAuth Configuration Error"

**Solution**:
1. Vérifiez que `NEXTAUTH_SECRET` est bien défini dans `.env.production`
2. Vérifiez que `NEXTAUTH_URL` correspond à votre domaine exact

### Le Site Ne Se Charge Pas

**Solution**:
1. Vérifiez les logs de l'application Node.js dans cPanel
2. Vérifiez que le build s'est terminé sans erreur: `npm run build`
3. Vérifiez que toutes les dépendances sont installées: `npm install`

### Les Images Ne S'Affichent Pas

**Solution**:
1. Vérifiez que le dossier `public/` a été uploadé correctement
2. Vérifiez les permissions du dossier: `chmod -R 755 public/`

---

## 📝 Commandes Utiles

### Voir les Logs
```bash
cd ~/nature-pharmacy
tail -f logs/error.log
```

### Redémarrer l'Application
```bash
cd ~/nature-pharmacy
npm run start
```

### Mettre à Jour le Site
```bash
cd ~/nature-pharmacy
git pull origin master
npm install
npm run build
# Redémarrer l'app via cPanel ou SSH
```

---

## 🔐 Sécurité - Après Validation Client

Une fois que le client a validé le site, vous devriez:

1. **Retirer la protection par mot de passe**:
   - Supprimez la ligne `SITE_PASSWORD=...` de `.env.production`
   - Redémarrez l'application

2. **Configurer un vrai système d'authentification**:
   - Le site utilise déjà NextAuth pour les utilisateurs
   - Seuls les utilisateurs enregistrés peuvent acheter/vendre

3. **Configurer HTTPS** (normalement déjà fait par Bluehost):
   - Activez SSL/TLS dans cPanel
   - Forcez HTTPS pour tout le site

---

## 📧 Support

En cas de problème:
1. Vérifiez les logs d'erreur
2. Consultez la documentation Bluehost pour Node.js
3. Vérifiez la configuration MongoDB Atlas
4. Contactez le support Bluehost si nécessaire

---

**Dernière mise à jour**: Décembre 2024
**Version du site**: 1.0.0
