# 🚀 Guide de Déploiement Complet - Nature Pharmacy

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Déploiement sur Vercel](#déploiement-sur-vercel)
3. [Configuration du Domaine Personnalisé](#configuration-du-domaine-personnalisé)
4. [Protection par Mot de Passe](#protection-par-mot-de-passe)
5. [Mises à Jour Futures](#mises-à-jour-futures)
6. [Dépannage](#dépannage)

---

## 🎯 Prérequis

Avant de commencer, assurez-vous d'avoir:

- ✅ Compte GitHub avec le projet: `https://github.com/Magnetiksn2025/nature-pharmacy`
- ✅ MongoDB Atlas configuré et accessible
- ✅ Domaine `naturepharmacy.com` avec accès aux paramètres DNS

---

## 🚀 Déploiement sur Vercel

### Pourquoi Vercel?

- ✅ **Gratuit** pour les projets personnels
- ✅ **Optimisé** pour Next.js (créé par la même équipe)
- ✅ **Rapide** - déploiement en 2 minutes
- ✅ **Automatique** - redéploiement à chaque commit GitHub
- ✅ **SSL gratuit** - HTTPS automatique
- ✅ **Pas de limitation mémoire** (contrairement à Bluehost)

### Étape 1: Créer un Compte Vercel

1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à votre compte GitHub

### Étape 2: Importer le Projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Sélectionnez le repo **"Magnetiksn2025/nature-pharmacy"**
3. Cliquez sur **"Import"**

### Étape 3: Configuration du Build

Vercel détecte automatiquement Next.js. Vérifiez que:

- **Framework Preset**: Next.js ✓
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Root Directory**: `./`

### Étape 4: Configuration Vercel Blob (Upload d'Images)

**IMPORTANT**: Avant de configurer les variables d'environnement, créez d'abord Vercel Blob:

1. Dans votre projet Vercel, allez dans **Storage** (menu de gauche)
2. Cliquez sur **"Create Database"**
3. Sélectionnez **"Blob"**
4. Cliquez sur **"Create"**

Vercel configure automatiquement la variable `BLOB_READ_WRITE_TOKEN` pour vous.

📖 **Documentation complète**: Voir [VERCEL_BLOB_SETUP.md](VERCEL_BLOB_SETUP.md)

### Étape 5: Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez:

```env
MONGODB_URI=mongodb+srv://naturepharm_db_user:6Dl0TORBT68tEWsh@cluster0.fzzhugg.mongodb.net/nature-pharmacy?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_SECRET=PHTDTccZG68MO/HJWgV4u1JF6GxUU6Tamrj5s/V9vdc=

NEXTAUTH_URL=https://naturepharmacy.com

SITE_PASSWORD=clientpreview2024

NODE_ENV=production
```

**Important**:
- Utilisez `NEXTAUTH_URL=https://naturepharmacy.com` directement (votre domaine personnalisé)
- Si vous n'avez pas encore configuré le domaine, utilisez temporairement l'URL Vercel, puis mettez à jour après
- `BLOB_READ_WRITE_TOKEN` est automatiquement ajouté quand vous créez Vercel Blob (étape 4)

### Étape 6: Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-3 minutes ⏱️
3. Une fois terminé, vous verrez:
   - ✅ **"Your project is live!"**
   - 🔗 URL temporaire: `https://nature-pharmacy-xxx.vercel.app`

---

## 🌐 Configuration du Domaine Personnalisé

### Étape 1: Ajouter le Domaine dans Vercel

1. Dans votre projet Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add Domain"**
3. Entrez: `naturepharmacy.com`
4. Cliquez sur **"Add"**
5. Vercel vous donnera les enregistrements DNS à configurer

### Étape 2: Configuration DNS

Vous aurez besoin de configurer ces enregistrements DNS chez votre registrar de domaine:

#### Option A: Enregistrement A (Recommandé)

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### Option B: Enregistrement CNAME

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: 3600
```

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### Étape 3: Vérification

1. Après avoir configuré les DNS, retournez dans Vercel
2. Cliquez sur **"Verify"** à côté de votre domaine
3. La propagation DNS peut prendre **quelques minutes à 48 heures**
4. Une fois vérifié, Vercel génère automatiquement un **certificat SSL gratuit**

### Étape 4: Redirection www → domaine principal

Dans Vercel → Settings → Domains:

1. Ajoutez également `www.naturepharmacy.com`
2. Configurez-le pour rediriger vers `naturepharmacy.com`
3. Cela garantit que les deux versions fonctionnent

### Étape 5: Vérifier NEXTAUTH_URL

1. Dans Vercel → Settings → Environment Variables
2. Vérifiez que `NEXTAUTH_URL=https://naturepharmacy.com`
3. Si vous l'avez modifié, redéployez:
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** du dernier déploiement
   - Cliquez sur **"Redeploy"**

---

## 🔐 Protection par Mot de Passe

Le site est protégé par un mot de passe pour la phase de preview client.

### Comment ça Fonctionne

1. **Middleware de Protection**: Le fichier [middleware.ts](./middleware.ts) vérifie le mot de passe
2. **Variable d'Environnement**: `SITE_PASSWORD=clientpreview2024`
3. **Session Cookie**: Stocke l'état d'authentification

### Accès au Site

1. Visitez `https://naturepharmacy.com`
2. Entrez le mot de passe: `clientpreview2024`
3. Le cookie reste valide pendant la session

### Désactiver la Protection (Site Public)

Une fois le client satisfait et prêt à lancer le site:

1. Dans Vercel: **Settings** → **Environment Variables**
2. **Supprimez** la variable `SITE_PASSWORD`
3. Cliquez sur **Save**
4. Redéployez le projet
5. Le site devient accessible sans mot de passe

### Changer le Mot de Passe

1. Dans Vercel: **Settings** → **Environment Variables**
2. Modifiez la valeur de `SITE_PASSWORD`
3. Cliquez sur **Save**
4. Redéployez le projet

---

## 🔄 Mises à Jour Futures

### Déploiement Automatique

Vercel redéploie automatiquement à chaque `git push` sur la branche `master`.

### Workflow de Mise à Jour

1. **Faites vos modifications** localement dans le code

2. **Testez localement**:
   ```bash
   npm run dev
   ```

3. **Committez les changements**:
   ```bash
   git add .
   git commit -m "Description des changements"
   ```

4. **Poussez sur GitHub**:
   ```bash
   git push origin master
   ```

5. **Vercel redéploie automatiquement** en 2-3 minutes

6. **Vérifiez le déploiement**:
   - Dashboard Vercel → Deployments
   - Statut: ✅ Ready

### Rollback (Retour Arrière)

Si un déploiement pose problème:

1. Allez dans **Deployments**
2. Trouvez le déploiement précédent qui fonctionnait
3. Cliquez sur les **3 points** → **"Promote to Production"**
4. Le site revient instantanément à cette version

---

## 🛠️ Dépannage

### Erreur: 404 Page Not Found

**Cause**: `NEXTAUTH_URL` ne correspond pas à l'URL réelle

**Solution**:
1. Vérifiez Vercel → Settings → Environment Variables
2. `NEXTAUTH_URL` doit être `https://naturepharmacy.com`
3. Redéployez

### Erreur: CLIENT_FETCH_ERROR

**Cause**: NextAuth ne peut pas se connecter à l'API

**Solution**:
1. Vérifiez que `NEXTAUTH_URL` est correct
2. Vérifiez que `NEXTAUTH_SECRET` est défini
3. Vérifiez les logs Vercel pour plus de détails

### Erreur: Failed to Connect to Database

**Cause**: MongoDB URI invalide ou base de données inaccessible

**Solution**:
1. Vérifiez `MONGODB_URI` dans les variables d'environnement
2. Testez la connexion MongoDB Atlas:
   - Vérifiez l'IP whitelist (0.0.0.0/0 pour autoriser Vercel)
   - Vérifiez le nom d'utilisateur/mot de passe

### DNS ne se Propage Pas

**Cause**: Propagation DNS en cours

**Solution**:
1. Attendez 24-48 heures maximum
2. Vérifiez la configuration DNS avec: https://dnschecker.org
3. Effacez le cache DNS local:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

### Build Failed sur Vercel

**Cause**: Erreurs TypeScript ou dépendances manquantes

**Solution**:
1. Vérifiez les logs Vercel pour l'erreur exacte
2. Testez le build localement:
   ```bash
   npm run build
   ```
3. Vérifiez que toutes les dépendances sont dans `package.json`

### Site Lent

**Optimisations**:
- Images: Utilisez le composant `next/image` (déjà fait)
- Cache: Vercel CDN met en cache automatiquement
- Base de données: Utilisez MongoDB Atlas dans la région la plus proche

---

## 📊 Fonctionnalités Vercel (Plan Gratuit)

- ✅ **100 GB** de bande passante/mois
- ✅ **Déploiements illimités**
- ✅ **SSL/HTTPS** gratuit
- ✅ **CDN global** (site rapide partout)
- ✅ **Logs en temps réel**
- ✅ **Analytics** de base
- ✅ **Aperçu automatique** pour chaque PR

---

## 📞 Support

- **Documentation Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Documentation Next.js**: [nextjs.org/docs](https://nextjs.org/docs)
- **Support Vercel**: [vercel.com/support](https://vercel.com/support)
- **MongoDB Atlas**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

## ✅ Checklist de Déploiement

- [ ] Compte Vercel créé et lié à GitHub
- [ ] Projet importé depuis GitHub
- [ ] Variables d'environnement configurées
- [ ] Premier déploiement réussi
- [ ] Domaine personnalisé ajouté dans Vercel
- [ ] DNS configurés chez le registrar
- [ ] Domaine vérifié dans Vercel
- [ ] SSL activé automatiquement
- [ ] `NEXTAUTH_URL` mis à jour avec le domaine personnalisé
- [ ] Site testé avec le mot de passe
- [ ] Toutes les fonctionnalités testées en production

---

**Temps total de déploiement**: ~15 minutes (hors propagation DNS)

**Site en production**: https://naturepharmacy.com 🎉
