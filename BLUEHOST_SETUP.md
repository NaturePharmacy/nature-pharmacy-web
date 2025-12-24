# Configuration Bluehost pour l'Upload d'Images

Le système d'upload d'images utilise votre hébergement **Bluehost** via SFTP (déjà payé, pas de coûts supplémentaires).

## Avantages de cette solution

- ✅ **Gratuit** - Utilise votre hébergement déjà payé
- ✅ **Stockage illimité** - Selon votre plan Bluehost
- ✅ **Optimisation automatique** - Conversion en WebP, compression, redimensionnement
- ✅ **Pas de limite de bande passante** - Contrairement à Cloudinary
- ✅ **Contrôle total** - Vos images restent sur votre serveur

## Étapes de configuration

### 1. Trouver vos identifiants SFTP Bluehost

#### Option A: Via cPanel (Recommandé)

1. Connectez-vous à votre compte Bluehost
2. Allez dans **cPanel**
3. Cherchez la section **"Files"** (Fichiers)
4. Cliquez sur **"FTP Accounts"** (Comptes FTP)
5. Vous verrez vos identifiants SFTP:
   - **Host** (Hôte): `ftp.votredomaine.com` ou `votredomaine.com`
   - **Username** (Nom d'utilisateur): souvent votre nom de domaine ou compte principal
   - **Port**: `22` (pour SFTP)

#### Option B: Via Email de Bienvenue Bluehost

Cherchez l'email de bienvenue Bluehost qui contient:
- Serveur FTP/SFTP
- Nom d'utilisateur
- Mot de passe

### 2. Créer le dossier uploads sur Bluehost

#### Via cPanel File Manager:

1. Dans **cPanel**, cliquez sur **"File Manager"**
2. Naviguez vers **`public_html`**
3. Créez un nouveau dossier nommé **`uploads`**
4. Créez un sous-dossier **`products`** dans `uploads`

La structure sera:
```
public_html/
  └── uploads/
      └── products/
```

#### Via FTP Client (FileZilla):

1. Téléchargez [FileZilla](https://filezilla-project.org/)
2. Connectez-vous avec vos identifiants SFTP
3. Naviguez vers `public_html`
4. Créez le dossier `uploads/products`

### 3. Configurer les variables d'environnement

Ouvrez le fichier `.env.local` et ajoutez:

```env
# Bluehost SFTP Configuration
BLUEHOST_SFTP_HOST=ftp.votredomaine.com
BLUEHOST_SFTP_PORT=22
BLUEHOST_SFTP_USERNAME=votre_username
BLUEHOST_SFTP_PASSWORD=votre_password

# Bluehost Upload Configuration
BLUEHOST_UPLOAD_DIR=/public_html/uploads
BLUEHOST_PUBLIC_URL=https://votredomaine.com
```

**Exemple concret:**
```env
# Si votre domaine est example.com
BLUEHOST_SFTP_HOST=ftp.example.com
BLUEHOST_SFTP_PORT=22
BLUEHOST_SFTP_USERNAME=example@example.com
BLUEHOST_SFTP_PASSWORD=VotreMotDePasse123!

BLUEHOST_UPLOAD_DIR=/public_html/uploads
BLUEHOST_PUBLIC_URL=https://example.com
```

### 4. Ajouter les variables sur Vercel (Production)

1. Allez sur [vercel.com](https://vercel.com)
2. Ouvrez votre projet **nature-pharmacy**
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les mêmes variables que dans `.env.local`:
   - `BLUEHOST_SFTP_HOST`
   - `BLUEHOST_SFTP_PORT`
   - `BLUEHOST_SFTP_USERNAME`
   - `BLUEHOST_SFTP_PASSWORD`
   - `BLUEHOST_UPLOAD_DIR`
   - `BLUEHOST_PUBLIC_URL`

5. Cliquez sur **"Save"** pour chaque variable
6. Redéployez votre application

### 5. Tester la connexion

Une fois les variables configurées:

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
npm run dev
```

## Utilisation

### Dans le formulaire produit

Le composant `ImageUpload` fonctionne exactement pareil qu'avant, mais maintenant:
- ✅ Les images sont uploadées sur **votre Bluehost**
- ✅ Elles sont **automatiquement optimisées** (WebP, compression, resize)
- ✅ Elles sont **accessibles publiquement** via votre domaine

**URL des images uploadées:**
```
https://votredomaine.com/uploads/products/1234567890-image.webp
```

### Fonctionnalités automatiques

1. **Optimisation:**
   - Redimensionnement max 1200x1200px
   - Conversion en WebP (85% qualité)
   - Compression automatique

2. **Organisation:**
   - Images produits: `uploads/products/`
   - Noms uniques avec timestamp

3. **Sécurité:**
   - Validation type (JPEG, PNG, WebP)
   - Validation taille (max 5MB)
   - Upload sécurisé via SFTP

## Structure des dossiers Bluehost

```
public_html/
  └── uploads/
      ├── products/          # Images de produits
      │   ├── 1234567890-product1.webp
      │   └── 1234567891-product2.webp
      └── avatars/           # (À venir) Avatars utilisateurs
```

## Sécurité

⚠️ **Important:**
- Ne commitez **JAMAIS** `.env.local` dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- Gardez vos identifiants SFTP confidentiels
- Utilisez un mot de passe fort pour votre compte Bluehost

## Permissions requises

Les dossiers `uploads` doivent avoir les permissions correctes:
- **Dossier uploads**: `755` (lecture/écriture pour vous, lecture pour autres)
- **Fichiers images**: `644` (lecture/écriture pour vous, lecture pour autres)

Ces permissions sont généralement configurées automatiquement par Bluehost.

## Troubleshooting

### Erreur: "Failed to connect to Bluehost"

**Causes possibles:**
- Identifiants SFTP incorrects
- Host incorrect (essayez avec et sans `ftp.`)
- Port incorrect (doit être `22` pour SFTP)
- Firewall bloque la connexion

**Solutions:**
1. Vérifiez vos identifiants dans cPanel
2. Essayez de vous connecter avec FileZilla pour tester
3. Vérifiez que le port 22 est ouvert
4. Contactez le support Bluehost si nécessaire

### Erreur: "Permission denied"

**Solution:**
1. Vérifiez que le dossier `uploads` existe dans `public_html`
2. Vérifiez les permissions du dossier (755)
3. Vérifiez que vous utilisez le bon chemin: `/public_html/uploads`

### Images ne s'affichent pas

**Solutions:**
1. Vérifiez que `BLUEHOST_PUBLIC_URL` est correct
2. Vérifiez que le dossier `uploads` est dans `public_html`
3. Testez l'URL directement: `https://votredomaine.com/uploads/products/nom-fichier.webp`
4. Vérifiez les permissions des fichiers (644)

### Upload très lent

**Causes:**
- Connexion internet lente
- Serveur Bluehost surchargé
- Image trop volumineuse

**Solutions:**
1. Optimisez l'image avant upload (déjà fait automatiquement)
2. Vérifiez votre connexion internet
3. Essayez à un autre moment si le serveur est surchargé

## Comparaison: Cloudinary vs Bluehost

| Fonctionnalité | Cloudinary (Gratuit) | Bluehost (Votre hébergement) |
|----------------|---------------------|------------------------------|
| Stockage | 25 GB | Illimité (selon plan) |
| Bande passante | 25 GB/mois | Illimitée |
| Coût | Gratuit puis cher | Déjà payé |
| Optimisation | Automatique | Automatique (sharp) |
| Vitesse upload | Rapide | Moyen |
| Contrôle | Limité | Total |

## Migration depuis Cloudinary

Si vous aviez des images sur Cloudinary, vous pouvez:
1. Les laisser là (elles continueront de fonctionner)
2. Les télécharger et les re-uploader vers Bluehost
3. Mettre à jour les URLs dans la base de données

## Support

En cas de problème:
1. Vérifiez d'abord ce guide de troubleshooting
2. Testez la connexion SFTP avec FileZilla
3. Consultez la [documentation Bluehost](https://www.bluehost.com/help)
4. Contactez le support Bluehost si nécessaire

## Améliorations futures possibles

- [ ] CDN Cloudflare pour accélérer le chargement des images
- [ ] Compression supplémentaire avec TinyPNG
- [ ] Upload en masse pour les vendeurs
- [ ] Galerie de gestion des images
- [ ] Statistiques d'utilisation du stockage
