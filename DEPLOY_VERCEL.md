# 🚀 Déploiement sur Vercel - Nature Pharmacy

## Pourquoi Vercel ?

- ✅ **Gratuit** pour les projets personnels
- ✅ **Optimisé** pour Next.js (créé par la même équipe)
- ✅ **Rapide** - déploiement en 2 minutes
- ✅ **Automatique** - redéploiement à chaque commit GitHub
- ✅ **SSL gratuit** - HTTPS automatique

---

## 📋 Étape 1: Créer un Compte Vercel

1. Allez sur **[vercel.com](https://vercel.com)**
2. Cliquez sur **"Sign Up"**
3. Choisissez **"Continue with GitHub"**
4. Autorisez Vercel à accéder à votre compte GitHub

---

## 🔗 Étape 2: Importer le Projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**

2. Sélectionnez le repo **"Magnetiksn2025/nature-pharmacy"**

3. Cliquez sur **"Import"**

---

## ⚙️ Étape 3: Configuration

### Framework Preset
- Vercel détecte automatiquement **Next.js** ✓

### Build Settings
- **Build Command**: `npm run build` (déjà configuré)
- **Output Directory**: `.next` (déjà configuré)
- **Install Command**: `npm install` (déjà configuré)

### Root Directory
- Laissez vide ou mettez `./` si demandé

---

## 🔐 Étape 4: Variables d'Environnement

Cliquez sur **"Environment Variables"** et ajoutez:

```
MONGODB_URI = mongodb+srv://naturepharm_db_user:6Dl0TORBT68tEWsh@cluster0.fzzhugg.mongodb.net/nature-pharmacy?retryWrites=true&w=majority&appName=Cluster0

NEXTAUTH_SECRET = PHTDTccZG68MO/HJWgV4u1JF6GxUU6Tamrj5s/V9vdc=

NEXTAUTH_URL = https://votre-projet.vercel.app

SITE_PASSWORD = clientpreview2024

NODE_ENV = production
```

**Note**: Pour `NEXTAUTH_URL`, vous recevrez l'URL après le premier déploiement. Vous pourrez la mettre à jour après.

---

## 🚀 Étape 5: Déployer

1. Cliquez sur **"Deploy"**

2. Attendez 2-3 minutes ⏱️

3. Une fois terminé, vous verrez:
   - ✅ **"Your project is live!"**
   - 🔗 URL de votre site: `https://nature-pharmacy-xxx.vercel.app`

---

## 🔧 Étape 6: Mettre à Jour NEXTAUTH_URL

1. Copiez l'URL de votre site (ex: `https://nature-pharmacy-xxx.vercel.app`)

2. Dans Vercel, allez dans:
   - **Settings** → **Environment Variables**
   - Trouvez `NEXTAUTH_URL`
   - Cliquez sur **Edit**
   - Remplacez par votre vraie URL
   - Cliquez sur **Save**

3. **Redéployez**:
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** du dernier déploiement
   - Cliquez sur **"Redeploy"**

---

## ✅ Étape 7: Vérifier

Visitez votre site: `https://votre-projet.vercel.app`

Vous devriez voir:
1. La page de protection par mot de passe
2. Entrez: `clientpreview2024`
3. Accès au site complet ! 🎉

---

## 🎯 Domaine Personnalisé (Optionnel)

Pour utiliser votre propre domaine (ex: `naturepharmacy.com`):

1. Dans Vercel: **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer les DNS
4. Mettez à jour `NEXTAUTH_URL` avec le nouveau domaine

---

## 🔄 Mises à Jour Futures

Pour mettre à jour le site:

1. **Faites vos modifications** localement
2. **Committez**:
   ```bash
   git add .
   git commit -m "Description des changements"
   ```
3. **Poussez sur GitHub**:
   ```bash
   git push origin master
   ```
4. **Vercel redéploie automatiquement** en 2 minutes !

---

## 🔓 Désactiver la Protection (Après Validation)

Une fois le client satisfait:

1. Dans Vercel: **Settings** → **Environment Variables**
2. Supprimez `SITE_PASSWORD`
3. Redéployez
4. Le site devient public !

---

## 📊 Fonctionnalités Vercel Gratuites

- ✅ **100 GB** de bande passante/mois
- ✅ **Déploiements illimités**
- ✅ **SSL/HTTPS** gratuit
- ✅ **CDN global** (site rapide partout)
- ✅ **Logs en temps réel**
- ✅ **Analytics** de base

---

## 🆘 Support

- **Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Support**: [vercel.com/support](https://vercel.com/support)
- **Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Temps total**: ~10 minutes pour le premier déploiement ! 🚀
