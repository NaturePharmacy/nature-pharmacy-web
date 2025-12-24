# 🚀 Guide de Déploiement - Nature Pharmacy sur Bluehost

## 📋 Prérequis

- ✅ Compte Bluehost actif
- ✅ Accès SSH
- ✅ MongoDB Atlas déjà configuré (votre compte actuel)
- ✅ Les fichiers du projet

---

## 🔐 Étape 1: Se Connecter en SSH

### Via l'Interface Bluehost

1. Connectez-vous à votre interface **Bluehost**
2. Menu **Websites** → Section **Connect over SSH**
3. Vous verrez votre commande SSH: `ssh lbofromy@50.6.19.21`

### Depuis Votre Ordinateur

Ouvrez un terminal:
- **Windows**: PowerShell ou cmd
- **Mac/Linux**: Terminal

Exécutez:
```bash
ssh lbofromy@50.6.19.21
```

Entrez votre mot de passe Bluehost quand demandé.

---

## 📤 Étape 2: Uploader les Fichiers

### Via FileZilla (Recommandé)

**Note**: Buildez le projet LOCALEMENT d'abord (voir étape 2.1), puis uploadez tout.

1. Ouvrez **FileZilla**
2. Connectez-vous:
   - **Hôte**: `50.6.19.21`
   - **Utilisateur**: `lbofromy`
   - **Mot de passe**: Votre mot de passe Bluehost
   - **Port**: 21 (FTP) ou 22 (SFTP)

3. Naviguez vers `/home1/lbofromy/`
4. Créez un dossier `nature-pharmacy`
5. Uploadez **TOUS** les fichiers du projet (incluant `.next/`)

### 2.1 Build Local (AVANT upload)

Sur votre PC:
```bash
cd "c:\Users\pc\Nature Pharmacy\nature-pharmacy"
npm run build
```

⚠️ **Important**: Le serveur Bluehost n'a pas assez de RAM pour builder. Faites le build localement !

---

## ⚙️ Étape 3: Configuration

### 3.1 Créer le fichier .env.production

En SSH, dans le dossier du projet:
```bash
cd /home1/lbofromy/nature-pharmacy
nano .env.production
```

Copiez-collez ce contenu (utilisez votre MongoDB existant):
```env
# MongoDB (votre connexion actuelle)
MONGODB_URI=mongodb+srv://naturepharm_db_user:6Dl0TORBT68tEWsh@cluster0.fzzhugg.mongodb.net/nature-pharmacy?retryWrites=true&w=majority&appName=Cluster0

# NextAuth (remplacez l'URL par votre domaine Bluehost)
NEXTAUTH_URL=https://ibo.fro.mybluehost.me
NEXTAUTH_SECRET=PHTDTccZG68MO/HJWgV4u1JF6GxUU6Tamrj5s/V9vdc=

# Protection par mot de passe (pour accès client uniquement)
SITE_PASSWORD=clientpreview2024
```

**Pour sauvegarder dans nano**:
- `Ctrl+O` puis `Enter` pour sauvegarder
- `Ctrl+X` pour quitter

### 3.2 Installer les dépendances (sur serveur)

```bash
npm install --production
```

⏱️ Cela peut prendre 2-5 minutes.

**Note**: Pas besoin de `npm run build` - vous l'avez déjà fait localement et uploadé le dossier `.next/` !

---

## 🚀 Étape 4: Démarrer l'Application

### Via SSH

```bash
npm start
```

L'application démarre sur le port 3000 par défaut.

### Maintenir l'Application Active

Pour que l'application continue de tourner après fermeture du terminal, utilisez `pm2`:

```bash
# Installer pm2 (une seule fois)
npm install -g pm2

# Démarrer l'app avec pm2
pm2 start npm --name "nature-pharmacy" -- start

# Sauvegarder pour redémarrage auto
pm2 save
pm2 startup
```

**Commandes utiles pm2**:
```bash
pm2 status              # Voir l'état
pm2 logs               # Voir les logs
pm2 restart nature-pharmacy  # Redémarrer
pm2 stop nature-pharmacy     # Arrêter
```

---

## ✅ Étape 5: Accéder au Site

Votre site sera accessible à:
```
https://ibo.fro.mybluehost.me
```

Ou votre domaine personnalisé si configuré.

### Page de Protection

Au premier accès, vous verrez la page de protection par mot de passe.

**Mot de passe**: `clientpreview2024`

---

## 👥 Partager avec le Client

Envoyez au client:

```
🌿 Nature Pharmacy - Accès Prévisualisation

URL: https://ibo.fro.mybluehost.me
Mot de passe: clientpreview2024

Le mot de passe est valide pendant 7 jours après connexion.
```

---

## 🔓 Désactiver la Protection (Après Validation)

Une fois le client satisfait:

1. **Modifier .env.production**:
```bash
nano /home1/lbofromy/nature-pharmacy/.env.production
```

2. **Supprimer ou commenter la ligne**:
```env
# SITE_PASSWORD=clientpreview2024
```

3. **Sauvegarder** (`Ctrl+O`, `Enter`, `Ctrl+X`)

4. **Redémarrer l'app**:
```bash
pm2 restart nature-pharmacy
```

Le site devient accessible publiquement.

---

## 🔧 Dépannage

### L'application ne démarre pas

**Vérifiez les logs**:
```bash
pm2 logs nature-pharmacy
```

**Erreurs courantes**:
- **Port déjà utilisé**: Changez le port dans `package.json` ou `.env`
- **Erreur MongoDB**: Vérifiez `MONGODB_URI` dans `.env.production`
- **Module manquant**: Relancez `npm install`

### Erreur de build

```bash
# Nettoyer et reconstruire
rm -rf .next node_modules
npm install
npm run build
```

### Mettre à jour le site

1. Sur votre PC, buildez: `npm run build`
2. Uploadez les fichiers modifiés via FileZilla
3. En SSH:
```bash
cd /home1/lbofromy/nature-pharmacy
npm install --production
pm2 restart nature-pharmacy
```

---

## 📝 Notes Importantes

- ✅ **MongoDB**: Votre compte actuel fonctionne, pas besoin d'en créer un nouveau
- ✅ **HTTPS**: Bluehost gère automatiquement le certificat SSL
- ✅ **Domaine**: Remplacez `ibo.fro.mybluehost.me` par votre domaine si vous en avez un
- ✅ **Session**: La session client dure 7 jours après authentification

---

**Dernière mise à jour**: Décembre 2024
