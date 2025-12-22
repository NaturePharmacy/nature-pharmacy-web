# Guide de Style CSS - Nature Pharmacy

## 🎨 Système de Design Centralisé

Ce document décrit le système de design CSS centralisé pour garantir une cohérence visuelle et une accessibilité optimale sur tout le site.

## 📋 Table des Matières

1. [Variables CSS](#variables-css)
2. [Couleurs de Marque](#couleurs-de-marque)
3. [Échelle de Gris](#échelle-de-gris)
4. [Utilisation des Classes Tailwind](#utilisation-des-classes-tailwind)
5. [Règles d'Accessibilité](#règles-daccessibilité)
6. [Exemples d'Utilisation](#exemples-dutilisation)

---

## Variables CSS

### Localisation
- **Fichier principal**: `app/globals.css`
- **Configuration Tailwind**: `tailwind.config.js`

### Variables Disponibles

```css
:root {
  /* Brand Colors */
  --color-primary: #16a34a;        /* Vert principal */
  --color-primary-dark: #15803d;   /* Vert foncé (hover) */
  --color-primary-light: #22c55e;  /* Vert clair (accents) */
  --color-secondary: #065f46;      /* Émeraude foncé */

  /* Backgrounds */
  --background: #ffffff;           /* Fond principal */
  --background-alt: #f9fafb;       /* Fond alternatif */
  --background-accent: #f0fdf4;    /* Fond accentué (vert pâle) */

  /* Text Colors */
  --foreground: #111827;           /* Texte principal */
  --foreground-muted: #374151;     /* Texte secondaire */
  --foreground-light: #6b7280;     /* Texte tertiaire */

  /* Borders */
  --border: #e5e7eb;               /* Bordure normale */
  --border-dark: #d1d5db;          /* Bordure foncée */

  /* Status Colors */
  --success: #16a34a;              /* Succès */
  --warning: #f59e0b;              /* Avertissement */
  --error: #dc2626;                /* Erreur */
  --info: #3b82f6;                 /* Information */
}
```

---

## Couleurs de Marque

### Classes Tailwind Personnalisées

```js
// Utilisables avec bg-, text-, border-, etc.
brand-primary          // #16a34a (Green 600)
brand-primary-dark     // #15803d (Green 700)
brand-primary-light    // #22c55e (Green 500)
brand-secondary        // #065f46 (Emerald 800)
```

### Exemples d'Utilisation

```jsx
// Bouton principal
<button className="bg-brand-primary hover:bg-brand-primary-dark text-white">
  Click me
</button>

// Badge/Tag
<span className="bg-brand-primary-light text-green-900">
  New
</span>

// Texte accentué
<p className="text-brand-primary">
  Important message
</p>
```

---

## Échelle de Gris

### Hiérarchie des Textes

Notre échelle de gris est optimisée pour **WCAG AA** (contraste minimum 4.5:1).

| Classe | Couleur | Usage | Contraste |
|--------|---------|-------|-----------|
| `text-gray-900` | #111827 | **Titres principaux** (h1, h2) | ⭐⭐⭐⭐⭐ |
| `text-gray-800` | #1f2937 | Texte très important | ⭐⭐⭐⭐⭐ |
| `text-gray-700` | #374151 | **Texte secondaire** (descriptions) | ⭐⭐⭐⭐ |
| `text-gray-600` | #4b5563 | Texte de support | ⭐⭐⭐⭐ |
| `text-gray-500` | #6b7280 | **Texte tertiaire** (métadonnées) | ⭐⭐⭐ |
| `text-gray-400` | #9ca3af | Placeholders uniquement | ⭐⭐ |

### ⚠️ Règles Importantes

✅ **À FAIRE**:
- Utiliser `text-gray-900` pour les titres principaux
- Utiliser `text-gray-700` pour le texte normal
- Utiliser `text-gray-500` ou plus foncé sur fond blanc
- Toujours tester le contraste avec un outil de vérification

❌ **À ÉVITER**:
- `text-gray-400` ou plus clair sur fond blanc (sauf placeholders)
- `text-gray-600` ou plus clair sur fond de couleur
- Texte foncé sur fond foncé (mode sombre désactivé)

---

## Utilisation des Classes Tailwind

### Boutons

```jsx
// Bouton principal (vert)
<button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold">
  Action Principale
</button>

// Bouton secondaire (outline)
<button className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold">
  Action Secondaire
</button>

// Bouton danger
<button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
  Supprimer
</button>

// Bouton désactivé
<button className="bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-3 rounded-lg" disabled>
  Désactivé
</button>
```

### Cartes (Cards)

```jsx
<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Titre de la Carte
  </h3>
  <p className="text-gray-700 mb-4">
    Description du contenu de la carte.
  </p>
  <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
    En savoir plus
  </button>
</div>
```

### Badges/Tags

```jsx
// Badge de succès
<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
  En stock
</span>

// Badge d'avertissement
<span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
  Stock limité
</span>

// Badge d'erreur
<span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
  Rupture
</span>
```

### Formulaires

```jsx
// Input standard
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder:text-gray-400"
  placeholder="Entrez votre texte"
/>

// Label
<label className="block text-sm font-semibold text-gray-800 mb-2">
  Nom du champ
</label>

// Message d'erreur
<p className="text-sm text-red-600 mt-1">
  Ce champ est requis
</p>
```

---

## Règles d'Accessibilité

### 1. Contraste des Couleurs

**Minimum requis**: WCAG AA (4.5:1 pour texte normal, 3:1 pour texte large)

✅ **Combinaisons Approuvées**:
- Texte `text-gray-900` sur fond `bg-white`
- Texte `text-gray-700` sur fond `bg-gray-50`
- Texte `text-white` sur fond `bg-green-600`
- Texte `text-green-900` sur fond `bg-green-50`

❌ **Combinaisons Interdites**:
- Texte `text-gray-400` sur fond `bg-white` (contraste insuffisant)
- Texte `text-gray-600` sur fond `bg-gray-100` (contraste insuffisant)
- Tout texte foncé sur fond foncé

### 2. Focus Visible

Toujours inclure un état de focus visible pour la navigation au clavier:

```jsx
className="focus:ring-2 focus:ring-green-500 focus:outline-none"
```

### 3. Taille du Texte

- **Minimum**: 14px (0.875rem) pour le texte courant
- **Recommandé**: 16px (1rem) pour la majorité du contenu
- **Titres**: Au moins 18px (1.125rem)

---

## Exemples d'Utilisation

### Page d'Accueil - Section Hero

```jsx
<div className="bg-gradient-to-r from-green-50 to-white">
  <div className="max-w-7xl mx-auto px-4 py-12">
    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
      Médecine Naturelle & Traditionnelle
    </h1>
    <p className="text-lg text-gray-700 mb-6">
      Découvrez des remèdes naturels pour votre santé
    </p>
    <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold">
      Découvrir nos produits
    </button>
  </div>
</div>
```

### Carte Produit

```jsx
<div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
  <img src="..." alt="..." className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="font-bold text-gray-900 text-lg mb-2">
      Nom du Produit
    </h3>
    <p className="text-gray-700 text-sm mb-3">
      Description courte du produit
    </p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-gray-900">
        15.99 €
      </span>
      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
        Ajouter
      </button>
    </div>
  </div>
</div>
```

---

## 🚫 Mode Sombre Désactivé

**Important**: Le mode sombre automatique a été **désactivé** pour éviter les problèmes de contraste.

- Configuration dans `tailwind.config.js`: `darkMode: false`
- CSS global: Pas de `@media (prefers-color-scheme: dark)`
- Raison: Assurer une visibilité constante sur tous les appareils

Si le mode sombre est nécessaire à l'avenir, il devra être implémenté manuellement avec un système de bascule contrôlé par l'utilisateur.

---

## 🔧 Outils de Vérification

### Contraste des Couleurs
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

### Accessibilité Générale
- Extension Chrome: [WAVE](https://wave.webaim.org/extension/)
- Extension Chrome: [axe DevTools](https://www.deque.com/axe/devtools/)

---

## 📝 Checklist avant Publication

- [ ] Tous les textes ont un contraste WCAG AA minimum
- [ ] Les boutons ont des états hover/focus visibles
- [ ] Pas de `text-gray-400` ou plus clair sur fond blanc (sauf placeholders)
- [ ] Les titres utilisent `text-gray-900` ou `text-gray-800`
- [ ] Les liens ont un indicateur visuel au hover
- [ ] Le site est testé avec WAVE ou axe DevTools
- [ ] Le mode sombre n'est pas activé accidentellement

---

**Dernière mise à jour**: Décembre 2024
**Mainteneur**: Équipe Nature Pharmacy
