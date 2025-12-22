# 🔐 Guide de Configuration MongoDB Atlas

## ❌ Erreur : Could not connect to MongoDB Atlas

Cette erreur signifie que votre adresse IP n'est pas autorisée à se connecter à MongoDB Atlas.

---

## ✅ Solution : Ajouter votre IP à la whitelist

### Étape 1 : Se connecter à MongoDB Atlas

1. Allez sur **https://cloud.mongodb.com**
2. Connectez-vous avec vos identifiants
3. Sélectionnez votre projet (nature-pharmacy ou similaire)

### Étape 2 : Accéder à Network Access

1. Dans le menu de gauche, cliquez sur **"Network Access"**
2. Vous verrez la liste des IP autorisées

![Network Access](https://i.imgur.com/example.png)

### Étape 3 : Ajouter une IP

Cliquez sur le bouton vert **"Add IP Address"**

Vous avez 2 options :

#### Option A : Autoriser toutes les IPs (Recommandé pour développement)

1. Cliquez sur **"Allow Access from Anywhere"**
2. L'adresse `0.0.0.0/0` sera ajoutée automatiquement
3. Ajoutez un commentaire : `Development - Allow All`
4. Cliquez sur **"Confirm"**

**Avantages :**
- ✅ Fonctionne de n'importe où
- ✅ Pas besoin de rajouter votre IP si elle change
- ✅ Idéal pour le développement

**Inconvénients :**
- ⚠️ Moins sécurisé
- ⚠️ Ne PAS utiliser en production

#### Option B : Autoriser uniquement votre IP actuelle (Plus sécurisé)

1. Cliquez sur **"Add Current IP Address"**
2. Votre IP sera détectée automatiquement
3. Ajoutez un commentaire : `My Home IP`
4. Cliquez sur **"Confirm"**

**Avantages :**
- ✅ Plus sécurisé
- ✅ Contrôle précis

**Inconvénients :**
- ⚠️ Si votre IP change (ex: redémarrage du routeur), vous devrez la rajouter
- ⚠️ Ne fonctionne que depuis votre réseau actuel

### Étape 4 : Attendre la prise en effet

⏱️ **Attendez 1-2 minutes** que la modification soit appliquée.

MongoDB Atlas doit propager la configuration à tous ses serveurs.

### Étape 5 : Tester la connexion

```bash
# Arrêtez le serveur (Ctrl+C)
# Relancez-le
npm run dev

# Essayez de créer un compte ou de vous connecter
```

---

## 🔍 Vérifier que ça fonctionne

### Test 1 : Vérifier la connexion dans les logs

Quand vous lancez `npm run dev`, vous devriez voir :
```
✅ MongoDB connected successfully
```

Si vous voyez :
```
❌ MongoDB connection error
```
→ L'IP n'est pas encore autorisée

### Test 2 : Créer un compte

1. Allez sur http://localhost:3001/fr/register
2. Remplissez le formulaire
3. Cliquez sur "S'inscrire"

**Résultat attendu :** Vous êtes redirigé vers la page d'accueil et connecté.

**Si erreur :** Vérifiez les étapes ci-dessus.

---

## 🔑 Vérifier les credentials MongoDB

Votre fichier `.env.local` doit contenir :

```env
MONGODB_URI=mongodb+srv://naturepharm_db_user:6Dl0TORBT68tEWsh@cluster0.fzzhugg.mongodb.net/nature-pharmacy?retryWrites=true&w=majority&appName=Cluster0
```

### Vérifier l'utilisateur dans MongoDB Atlas

1. Allez dans **Database Access** (menu de gauche)
2. Vérifiez que l'utilisateur `naturepharm_db_user` existe
3. Vérifiez qu'il a les droits `readWriteAnyDatabase` ou `readWrite` sur votre base

### Si l'utilisateur n'existe pas

1. Cliquez sur **"Add New Database User"**
2. Choisissez **Password** comme méthode d'authentification
3. Username : `naturepharm_db_user`
4. Password : `6Dl0TORBT68tEWsh` (ou générez-en un nouveau)
5. Database User Privileges : Sélectionnez **"Read and write to any database"**
6. Cliquez sur **"Add User"**

---

## 🆘 Dépannage avancé

### Problème : "Bad auth : authentication failed"

**Cause :** Le mot de passe ou l'username est incorrect.

**Solution :**
1. Allez dans **Database Access**
2. Cliquez sur **"Edit"** sur l'utilisateur `naturepharm_db_user`
3. Cliquez sur **"Edit Password"**
4. Générez un nouveau mot de passe
5. Copiez-le
6. Mettez à jour `.env.local` avec le nouveau mot de passe

### Problème : "Connection timeout"

**Cause :** L'IP n'est pas encore whitelistée ou le firewall bloque la connexion.

**Solutions :**
1. Vérifiez que vous avez bien ajouté `0.0.0.0/0` dans Network Access
2. Attendez 2-3 minutes
3. Vérifiez que votre firewall/antivirus ne bloque pas la connexion
4. Désactivez temporairement le VPN si vous en utilisez un

### Problème : "Cannot read properties of null"

**Cause :** La base de données n'est pas encore créée.

**Solution :**
La base de données `nature-pharmacy` sera créée automatiquement au premier insert de données.
Pas besoin de la créer manuellement.

---

## 🌍 Alternative : MongoDB Local

Si MongoDB Atlas ne fonctionne toujours pas, utilisez MongoDB en local :

### Installation

1. Téléchargez MongoDB Community Edition : https://www.mongodb.com/try/download/community
2. Installez-le avec les options par défaut
3. MongoDB démarre automatiquement comme service Windows

### Configuration

Modifiez `.env.local` :
```env
# Commentez MongoDB Atlas
# MONGODB_URI=mongodb+srv://...

# Utilisez MongoDB Local
MONGODB_URI=mongodb://localhost:27017/nature-pharmacy
```

### Démarrage

```bash
# Vérifier que MongoDB tourne
mongod --version

# Si ce n'est pas le cas, démarrez-le
mongod

# Dans un autre terminal
npm run dev
```

---

## ✅ Checklist finale

Avant de continuer, vérifiez :

- [ ] Vous êtes connecté à MongoDB Atlas
- [ ] Vous avez ajouté `0.0.0.0/0` dans Network Access
- [ ] Vous avez attendu 2 minutes
- [ ] L'utilisateur `naturepharm_db_user` existe dans Database Access
- [ ] Le `.env.local` contient la bonne URI MongoDB
- [ ] Le serveur a été redémarré (`npm run dev`)
- [ ] Vous pouvez créer un compte sans erreur

---

**Si tout est coché et ça ne fonctionne toujours pas, passez à MongoDB Local.**

**Dernière mise à jour :** Décembre 2025
