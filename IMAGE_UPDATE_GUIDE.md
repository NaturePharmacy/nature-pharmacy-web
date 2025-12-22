# Guide de Mise à Jour des Images - Médecine Traditionnelle

## 📸 Images Actuelles du Site

### 1. **Page d'Accueil** (`app/[locale]/page.tsx`)

#### Catégories Principales (ligne 38-43)
- **Plantes Médicinales** 🌿
  - URL actuelle: `https://images.unsplash.com/photo-1515377905703-c4788e51af15`
  - Recommandation: Image de plantes médicinales fraîches (basilic sacré, ginseng, etc.)

- **Huiles Essentielles** 💧
  - URL actuelle: `https://images.unsplash.com/photo-1608571423902-eed4a5ad8108`
  - Recommandation: Bouteilles d'huiles essentielles avec plantes aromatiques

- **Cosmétiques Naturels** ✨
  - URL actuelle: `https://images.unsplash.com/photo-1556228720-195a672e8a03`
  - Recommandation: Produits cosmétiques naturels (crèmes, savons artisanaux)

- **Tisanes Thérapeutiques** 🍵
  - URL actuelle: `https://images.unsplash.com/photo-1545045456-50f87ead1d06`
  - Recommandation: Tisane dans une tasse avec herbes séchées

- **Remèdes Traditionnels** 🏺
  - URL actuelle: `https://images.unsplash.com/photo-1505751172876-fa1923c5c528`
  - Recommandation: Pots d'herbes traditionnelles, mortier et pilon

- **Compléments Naturels** 💊
  - URL actuelle: `https://images.unsplash.com/photo-1584308666744-24d5c474f2ae`
  - Recommandation: Gélules naturelles, poudres de plantes

### 2. **Logos** (`public/`)
- **logo-fr.jpg** - Logo français
- **logo-en.jpg** - Logo anglais

**Recommandation**: Créer un logo unique reflétant:
- Éléments naturels (feuilles, plantes)
- Symboles de médecine traditionnelle
- Couleurs: vert naturel, brun terre, blanc pur

### 3. **Images de Remplacement** (placeholder)

Utilisées dans plusieurs fichiers pour les avatars et produits sans image:
- Rechercher: `/placeholder.png` ou `placeholder`
- Remplacer par: Une image par défaut de plantes médicinales

## 🎨 Recommandations de Design

### Style Visuel
- **Authenticité**: Photos réelles de remèdes traditionnels
- **Naturel**: Couleurs terreuses, textures organiques
- **Professionnalisme**: Images haute qualité, bien éclairées
- **Diversité**: Représenter différentes traditions médicinales

### Sources d'Images Suggérées

#### 1. **Unsplash** (Gratuit)
Mots-clés de recherche:
- "medicinal herbs"
- "traditional medicine"
- "herbal remedies"
- "essential oils"
- "natural cosmetics"
- "herbal tea"
- "ayurvedic"
- "chinese medicine"

#### 2. **Pexels** (Gratuit)
- Recherche similaire à Unsplash
- Licence libre pour usage commercial

#### 3. **Pixabay** (Gratuit)
- Grande collection d'images de plantes
- Filtres par couleur et orientation

### Dimensions Recommandées
- **Catégories**: 300x300px (ratio 1:1)
- **Bannières**: 1200x400px (ratio 3:1)
- **Logos**: 512x512px (format PNG transparent)
- **Produits**: 800x800px minimum

## 🔧 Comment Mettre à Jour

### Pour les URL Unsplash
1. Chercher l'image appropriée sur Unsplash
2. Copier l'URL avec paramètres: `?w=300&h=300&fit=crop`
3. Remplacer dans le fichier correspondant

### Pour les Logos
1. Créer/obtenir le nouveau logo
2. Placer dans `public/`
3. Nommer: `logo-fr.jpg`, `logo-en.jpg`

## 📝 Fichiers à Modifier

### Priorité Haute
- ✅ `app/[locale]/page.tsx` - Catégories homepage (lignes 38-43)
- ⚠️ `public/logo-fr.jpg` - Logo français
- ⚠️ `public/logo-en.jpg` - Logo anglais

### Priorité Moyenne
- `app/[locale]/products/page.tsx` - Images de filtres
- Fichiers utilisant `/placeholder.png`

### Priorité Basse
- Images utilisateur (peuvent rester en placeholder)
- Images dans les composants admin

## 🌍 Images par Région/Tradition

Considérer d'inclure des images représentant:
- **Médecine Africaine**: Baobab, moringa, karité
- **Médecine Asiatique**: Ginseng, gingembre, curcuma
- **Médecine Amérindienne**: Échinacée, sauge, calendula
- **Médecine Européenne**: Camomille, lavande, millepertuis

## ✅ Checklist de Validation

- [ ] Images en haute résolution (minimum 800px largeur)
- [ ] Licence appropriée pour usage commercial
- [ ] Style cohérent à travers le site
- [ ] Optimisation pour le web (compression)
- [ ] Texte alternatif (alt) descriptif
- [ ] Couleurs harmonieuses avec le thème vert/naturel

---

**Note**: Les images actuelles provenant d'Unsplash sont déjà libres de droits pour usage commercial. Vous pouvez les garder ou les remplacer par des images plus spécifiques à votre vision.
