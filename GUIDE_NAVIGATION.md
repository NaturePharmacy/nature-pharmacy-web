# 🧭 Guide de Navigation - Nature Pharmacy

## 📁 Structure du Projet

```
nature-pharmacy/
├── 📂 app/                          # Application Next.js
│   ├── 📂 [locale]/                 # Routes multilingues (fr, en, es)
│   │   ├── layout.tsx               # Layout principal avec i18n
│   │   └── page.tsx                 # Page d'accueil
│   └── globals.css                  # Styles globaux
│
├── 📂 components/                   # Composants réutilisables
│   ├── 📂 layout/
│   │   ├── Header.tsx              # Header avec navigation, recherche, panier
│   │   ├── Footer.tsx              # Footer avec liens et réseaux sociaux
│   │   └── LanguageSwitcher.tsx    # Sélecteur de langue FR/EN/ES
│   ├── 📂 products/                # (à créer) Composants produits
│   ├── 📂 cart/                    # (à créer) Composants panier
│   └── 📂 seller/                  # (à créer) Composants vendeur
│
├── 📂 lib/                          # Librairies et utilitaires
│   ├── 📂 db/                      # (à créer) Configuration base de données
│   ├── 📂 auth/                    # (à créer) Authentification
│   └── 📂 utils/                   # (à créer) Fonctions utilitaires
│
├── 📂 models/                       # (à créer) Modèles MongoDB
│   ├── User.ts                     # Modèle Utilisateur
│   ├── Product.ts                  # Modèle Produit
│   └── Order.ts                    # Modèle Commande
│
├── 📂 messages/                     # Traductions i18n
│   ├── en.json                     # Anglais
│   ├── fr.json                     # Français
│   └── es.json                     # Espagnol
│
├── 📂 public/                       # Fichiers statiques
│   ├── logo-fr.jpg                 # Logo français
│   └── logo-en.jpg                 # Logo anglais
│
├── 📂 i18n/                         # Configuration i18n
│   └── request.ts                  # Config next-intl
│
├── middleware.ts                    # Middleware pour i18n
├── next.config.ts                   # Configuration Next.js
├── tailwind.config.ts              # Configuration Tailwind CSS
├── tsconfig.json                   # Configuration TypeScript
└── package.json                    # Dépendances du projet
```

---

## 🌐 URLs Disponibles

### Page d'accueil
- **Français (défaut)**: http://localhost:3000/fr
- **Anglais**: http://localhost:3000/en
- **Espagnol**: http://localhost:3000/es

### Routes prévues (à développer)
- `/[locale]/products` - Liste des produits
- `/[locale]/product/[id]` - Détail d'un produit
- `/[locale]/cart` - Panier d'achat
- `/[locale]/checkout` - Page de paiement
- `/[locale]/login` - Connexion
- `/[locale]/register` - Inscription
- `/[locale]/seller/dashboard` - Tableau de bord vendeur
- `/[locale]/seller/products` - Gestion produits vendeur

---

## 🎨 Composants Principaux

### 1. Header (`components/layout/Header.tsx`)
**Fonctionnalités:**
- Logo dynamique selon la langue
- Barre de recherche
- Sélecteur de langue (FR/EN/ES)
- Icône panier avec compteur
- Lien connexion
- Menu de navigation

**Personnalisation:**
```tsx
// Pour modifier le logo
<Image src={locale === 'en' ? '/logo-en.jpg' : '/logo-fr.jpg'} />

// Pour modifier la recherche
<input placeholder={t('search')} />
```

### 2. Footer (`components/layout/Footer.tsx`)
**Sections:**
- À propos de Nature Pharmacy
- Liens rapides (aide, contact, CGU)
- Section vendeurs
- Réseaux sociaux
- Copyright

### 3. LanguageSwitcher (`components/layout/LanguageSwitcher.tsx`)
**Fonctionnalités:**
- Boutons FR/EN/ES
- Change la langue et rafraîchit la page
- Bouton actif mis en surbrillance

### 4. Page d'accueil (`app/[locale]/page.tsx`)
**Sections:**
- Bannière hero avec CTA
- Catégories (4 cartes)
- Produits en vedette (8 cartes)
- "Pourquoi nous choisir" (3 avantages)

---

## 🎨 Personnalisation du Design

### Couleurs principales (Tailwind)
```css
/* Vert principal */
green-600: #059669
green-700: #047857
green-800: #065f46

/* Gris */
gray-50: #f9fafb
gray-600: #4b5563
gray-900: #111827
```

### Modifier les couleurs
Éditez `tailwind.config.ts` pour personnaliser:
```ts
theme: {
  extend: {
    colors: {
      primary: '#059669',    // Votre couleur principale
      secondary: '#f59e0b',  // Couleur secondaire
    }
  }
}
```

---

## 🌍 Ajouter des Traductions

### 1. Ouvrir le fichier de langue
- **Français**: `messages/fr.json`
- **Anglais**: `messages/en.json`
- **Espagnol**: `messages/es.json`

### 2. Ajouter une nouvelle clé
```json
{
  "header": {
    "nouveauTexte": "Mon nouveau texte"
  }
}
```

### 3. Utiliser dans un composant
```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('header');
<p>{t('nouveauTexte')}</p>
```

---

## 🛠️ Commandes Utiles

### Démarrer le serveur
```bash
cd "C:\Users\pc\Nature Pharmacy\nature-pharmacy"
npm run dev
```
→ Ouvre http://localhost:3000

### Build pour production
```bash
npm run build
npm start
```

### Installer une nouvelle dépendance
```bash
npm install nom-du-package
```

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

### Linter le code
```bash
npm run lint
```

---

## 🔧 Fichiers de Configuration Importants

### 1. `middleware.ts`
Configure les routes multilingues:
```ts
locales: ['en', 'fr', 'es'],     // Langues supportées
defaultLocale: 'fr',              // Langue par défaut
```

### 2. `next.config.ts`
Configuration Next.js + next-intl:
```ts
images: {
  remotePatterns: [...]  // Autoriser images externes
}
```

### 3. `i18n/request.ts`
Charge les messages de traduction:
```ts
messages: (await import(`./messages/${locale}.json`)).default
```

---

## 📝 Comment Ajouter une Nouvelle Page

### 1. Créer le fichier dans `app/[locale]/`
```bash
# Exemple: créer une page "About"
touch app/[locale]/about/page.tsx
```

### 2. Contenu de la page
```tsx
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <h1>About Us</h1>
        {/* Votre contenu */}
      </main>
      <Footer />
    </div>
  );
}
```

### 3. Ajouter un lien dans le Header
```tsx
<Link href={`/${locale}/about`}>About</Link>
```

---

## 🎯 Prochaines Étapes de Développement

### Phase 1: Authentification ✅ À faire
- [ ] Configurer NextAuth.js
- [ ] Page de connexion
- [ ] Page d'inscription
- [ ] Gestion des rôles (acheteur/vendeur)

### Phase 2: Base de données ✅ À faire
- [ ] Configurer MongoDB
- [ ] Créer modèles Mongoose
- [ ] API routes pour CRUD

### Phase 3: Produits ✅ À faire
- [ ] Page listing produits
- [ ] Page détail produit
- [ ] Recherche et filtres
- [ ] Composants réutilisables

### Phase 4: Panier & Checkout ✅ À faire
- [ ] Système de panier (Context API)
- [ ] Page panier
- [ ] Formulaire checkout
- [ ] Intégration Stripe

### Phase 5: Dashboard Vendeur ✅ À faire
- [ ] Interface vendeur
- [ ] Ajout/modification produits
- [ ] Gestion commandes
- [ ] Statistiques

---

## 🐛 Dépannage

### Le serveur ne démarre pas
```bash
# Supprimer les fichiers cache
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

### Erreur de traduction
→ Vérifiez que la clé existe dans tous les fichiers de langue (en.json, fr.json, es.json)

### Images ne s'affichent pas
→ Vérifiez que les fichiers sont dans `/public/`
→ Utilisez le composant `<Image>` de Next.js

### Erreur TypeScript
```bash
# Vérifier les erreurs
npx tsc --noEmit
```

---

## 📚 Documentation Externe

- **Next.js**: https://nextjs.org/docs
- **Next-intl**: https://next-intl-docs.vercel.app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Mongoose**: https://mongoosejs.com/docs

---

## 👨‍💻 Support

Pour toute question sur le projet, référez-vous:
1. À ce guide de navigation
2. Au contrat de développement (contrat-Dev-signe.pdf)
3. Aux commentaires dans le code source

**Bon développement ! 🚀**
