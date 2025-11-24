# Configuration Cloudinary pour l'Upload d'Images

Le système d'upload d'images utilise **Cloudinary** (gratuit jusqu'à 25GB de stockage).

## Étapes de configuration

### 1. Créer un compte Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Cliquez sur "Sign Up for Free"
3. Créez un compte (vous pouvez utiliser Google/GitHub)

### 2. Récupérer vos identifiants

Une fois connecté à Cloudinary:

1. Allez sur le **Dashboard**
2. Vous verrez une section "Account Details" avec:
   - **Cloud Name** (ex: `dxyz123abc`)
   - **API Key** (ex: `123456789012345`)
   - **API Secret** (ex: `abcdef_ghijklmnopqrstuvwxyz`)

### 3. Configurer les variables d'environnement

Ouvrez le fichier `.env.local` et ajoutez:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
```

**Exemple:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef_ghijklmnopqrstuvwxyz
```

### 4. Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Redémarrer
npm run dev
```

## Utilisation

### Dans le formulaire produit

Le composant `ImageUpload` est déjà intégré dans:
- **`/seller/products/new`** - Création de produit
- **`/seller/products/edit/[id]`** - Édition de produit

**Fonctionnalités:**
- ✅ Drag & drop d'images
- ✅ Upload multiple (max 5 images)
- ✅ Validation de type (JPEG, PNG, WebP)
- ✅ Validation de taille (max 5MB par image)
- ✅ Compression automatique
- ✅ Optimisation format automatique
- ✅ Prévisualisation
- ✅ Suppression d'images

### Limites du plan gratuit

- **Stockage:** 25 GB
- **Bande passante:** 25 GB/mois
- **Transformations:** 25 000 transformations/mois
- **Vidéos:** 500 MB

C'est largement suffisant pour démarrer la plateforme!

## Structure des dossiers Cloudinary

Les images sont organisées par type:
- `nature-pharmacy/products/` - Images de produits
- `nature-pharmacy/avatars/` - Avatars utilisateurs (à venir)

## Sécurité

⚠️ **Important:**
- Ne commitez JAMAIS `.env.local` dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- L'API Secret doit rester confidentiel

## Troubleshooting

### Erreur: "Invalid credentials"
- Vérifiez que les credentials dans `.env.local` sont corrects
- Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
- Redémarrez le serveur après modification

### Erreur: "Upload failed"
- Vérifiez la taille du fichier (< 5MB)
- Vérifiez le format (JPEG, PNG, WebP uniquement)
- Vérifiez votre connexion internet

### Images ne s'affichent pas
- Vérifiez que l'URL Cloudinary est correcte
- Vérifiez que l'image n'a pas été supprimée de Cloudinary
- Vérifiez les CORS dans Cloudinary Dashboard

## Support

En cas de problème, consultez la [documentation Cloudinary](https://cloudinary.com/documentation).
