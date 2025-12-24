# 📤 Upload vers Bluehost avec FileZilla

## 🔧 Configuration FileZilla

### Connexion SFTP (Recommandé)

1. **Ouvrez FileZilla**

2. **Remplissez les champs en haut**:
   - **Hôte**: `sftp://50.6.19.21`
   - **Utilisateur**: `lbofromy`
   - **Mot de passe**: [Votre mot de passe Bluehost]
   - **Port**: `22`

3. **Cliquez sur "Connexion rapide"**

## 📁 Fichiers à Uploader

### Sur le serveur Bluehost

1. Naviguez vers: `/home1/lbofromy/`
2. Créez un dossier: `nature-pharmacy`
3. Entrez dans ce dossier

### Depuis votre PC

1. Naviguez vers: `c:\Users\pc\Nature Pharmacy\nature-pharmacy`

2. **Uploadez TOUS les fichiers et dossiers**, incluant:
   - ✅ `.next/` (155MB - dossier de build)
   - ✅ `app/`
   - ✅ `components/`
   - ✅ `lib/`
   - ✅ `models/`
   - ✅ `public/`
   - ✅ `messages/`
   - ✅ `hooks/`
   - ✅ `middleware.ts`
   - ✅ `package.json`
   - ✅ `package-lock.json`
   - ✅ `next.config.ts`
   - ✅ `tsconfig.json`
   - ✅ Tous les autres fichiers

3. **N'uploadez PAS**:
   - ❌ `node_modules/` (sera installé sur le serveur)
   - ❌ `.git/`
   - ❌ `.env` (créez .env.production sur le serveur)

## ⏱️ Temps d'Upload

- **Avec connexion rapide**: 5-10 minutes
- **Avec connexion lente**: 15-30 minutes

Le dossier `.next/` est le plus gros (155MB).

## ✅ Vérification

Une fois l'upload terminé, vérifiez sur le serveur:

```bash
ssh lbofromy@50.6.19.21
cd /home1/lbofromy/nature-pharmacy
ls -la
```

Vous devriez voir tous les dossiers listés ci-dessus.

## 🚀 Étapes Suivantes

Après l'upload, suivez [DEPLOY_QUICK.md](./DEPLOY_QUICK.md) à partir de l'étape 3 (Configuration).
