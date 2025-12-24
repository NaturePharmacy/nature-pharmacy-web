# Configuration Vercel Blob pour l'Upload d'Images

Le système d'upload d'images utilise **Vercel Blob Storage** pour la production (déploiement Vercel).

## Pourquoi Vercel Blob?

- ✅ **Gratuit jusqu'à 500 MB** - Largement suffisant pour démarrer
- ✅ **Ultra-rapide** - Optimisé pour Vercel, upload instantané
- ✅ **Pas de configuration SFTP** - Configuration automatique
- ✅ **Edge Network** - Images servies depuis le CDN le plus proche
- ✅ **Intégration native** - Fonctionne parfaitement avec Next.js
- ✅ **Optimisation automatique** - WebP, compression, resize 1200x1200

## Comparaison avec autres solutions

| Solution | Stockage Gratuit | Bande Passante | Complexité | Vitesse |
|----------|------------------|----------------|------------|---------|
| **Vercel Blob** | 500 MB | Illimitée | Très simple | Ultra rapide |
| Cloudinary | 25 GB | 25 GB/mois | Moyenne | Rapide |
| Bluehost SFTP | Illimité | Illimitée | Complexe | Moyen |

## Configuration (Automatique)

### Environnement de développement

Aucune configuration nécessaire! Vercel Blob fonctionne automatiquement en développement.

### Environnement de production (Vercel)

1. **Allez sur [vercel.com](https://vercel.com)**
2. **Ouvrez votre projet** `nature-pharmacy`
3. **Allez dans Storage** (menu de gauche)
4. **Cliquez sur "Create Database"**
5. **Choisissez "Blob"**
6. **Cliquez sur "Create"**

C'est tout! Vercel configure automatiquement la variable `BLOB_READ_WRITE_TOKEN`.

## Utilisation

### Upload d'images

Les vendeurs peuvent uploader des images de produits:
1. Maximum **5 images par produit**
2. Formats acceptés: **JPEG, PNG, WebP**
3. Taille max: **5 MB par image**
4. Optimisation automatique: **WebP, 1200x1200px, compression 85%**

### Organisation des fichiers

```
Vercel Blob/
  └── products/
      ├── 1234567890-product1.webp
      ├── 1234567891-product2.webp
      └── ...
```

Les images sont automatiquement nommées avec un timestamp unique.

## Limites du plan gratuit

| Ressource | Limite Gratuite | Dépassement |
|-----------|-----------------|-------------|
| Stockage | 500 MB | $0.15/GB/mois |
| Bande passante | Illimitée | Gratuit |
| Requêtes | 1M/mois | Gratuit |
| Fichiers | Illimité | Gratuit |

### Estimation de capacité

Avec 500 MB gratuit:
- **~5000 images** produits (100 KB/image après optimisation WebP)
- **~1000 images** haute qualité (500 KB/image)

Pour un marketplace qui démarre, c'est largement suffisant!

## Fonctionnalités

### Optimisation automatique

Toutes les images uploadées sont automatiquement:
1. **Redimensionnées** - Max 1200x1200px (conserve les proportions)
2. **Converties en WebP** - Format moderne ultra-compressé
3. **Compressées** - Qualité 85% (excellent compromis qualité/taille)

### Avantages WebP

- **30-50% plus léger** que JPEG/PNG
- **Qualité visuelle identique**
- **Supporté par tous les navigateurs modernes**
- **Chargement plus rapide** pour vos utilisateurs

## Surveillance de l'utilisation

1. Allez sur [vercel.com](https://vercel.com)
2. Ouvrez votre projet
3. Allez dans **Storage** → **Blob**
4. Vous verrez:
   - Stockage utilisé
   - Nombre de fichiers
   - Graphiques d'utilisation

## Troubleshooting

### Erreur: "Failed to upload image"

**Causes possibles:**
- Connexion internet instable
- Fichier trop volumineux (> 5 MB)
- Format non supporté

**Solutions:**
1. Vérifiez votre connexion
2. Compressez l'image avant upload
3. Utilisez JPEG, PNG ou WebP uniquement

### Erreur: "Quota exceeded"

Si vous dépassez 500 MB:

**Option 1: Upgrade Vercel (Recommandé)**
- $0.15/GB supplémentaire
- Très économique (5 GB = $0.75/mois)

**Option 2: Nettoyer les anciennes images**
1. Supprimez les images de produits archivés
2. Optimisez davantage (qualité 75% au lieu de 85%)

**Option 3: Passer à Bluehost SFTP**
- Voir `BLUEHOST_SETUP.md` (plus complexe)

### Images ne se chargent pas

**Solutions:**
1. Vérifiez que Vercel Blob est créé dans Storage
2. Vérifiez que l'application est redéployée après création du Blob
3. Consultez les logs Vercel pour les erreurs

## Migration vers Vercel Blob

Si vous aviez Cloudinary ou autre:

### Étape 1: Créer Vercel Blob
Suivez les instructions ci-dessus

### Étape 2: Upload de nouvelles images
Les nouvelles images iront automatiquement sur Vercel Blob

### Étape 3: Anciennes images (Optionnel)
Les anciennes images continueront de fonctionner sur leur ancien stockage

## Sécurité

✅ **Authentification requise** - Seuls les utilisateurs connectés peuvent uploader
✅ **Validation de type** - Seules les images sont acceptées
✅ **Validation de taille** - Max 5 MB
✅ **Noms uniques** - Timestamp pour éviter les conflits
✅ **URLs sécurisées** - HTTPS automatique

## Performance

### Temps d'upload moyens

- **Locale (dev)**: ~500ms
- **Production (Vercel)**: ~200ms
- **Image 1MB**: ~1-2 secondes total (upload + optimisation)

### Temps de chargement

- **CDN Edge**: ~50-100ms
- **Format WebP**: 30-50% plus rapide que JPEG
- **Cache navigateur**: Instantané après première visite

## Monitoring

### Vérifier les uploads

1. Allez sur [vercel.com](https://vercel.com)
2. Storage → Blob
3. Cliquez sur votre Blob store
4. Vous verrez tous les fichiers uploadés

### Logs d'erreur

1. Vercel Dashboard → votre projet
2. Allez dans **Logs**
3. Filtrez par "error"
4. Cherchez "upload" ou "blob"

## Évolution future

### Quand upgrader?

Upgrade si:
- Vous dépassez 500 MB
- Vous avez > 50 vendeurs actifs
- Vous avez > 500 produits avec 5 images chacun

### Alternatives si nécessaire

1. **Vercel Blob Pro** - $0.15/GB (simple, recommandé)
2. **Cloudflare R2** - $0.015/GB (très économique, plus complexe)
3. **Bluehost SFTP** - Gratuit mais plus lent (voir BLUEHOST_SETUP.md)

## Support

### Vercel Blob Documentation
[https://vercel.com/docs/storage/vercel-blob](https://vercel.com/docs/storage/vercel-blob)

### En cas de problème
1. Consultez ce guide
2. Vérifiez les logs Vercel
3. Consultez la documentation Vercel
4. Contactez le support Vercel (très réactif)

## Résumé

✅ **Simple** - Configuration en 2 clics
✅ **Gratuit** - 500 MB gratuit
✅ **Rapide** - Edge CDN mondial
✅ **Optimisé** - WebP automatique
✅ **Sécurisé** - HTTPS, validation, authentification
✅ **Évolutif** - Facile d'upgrader si nécessaire

Vercel Blob est **la solution parfaite pour démarrer** votre marketplace!
