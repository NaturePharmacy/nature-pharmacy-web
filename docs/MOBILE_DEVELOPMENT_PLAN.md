# Plan de Développement Mobile - Nature Pharmacy

Guide complet pour le développement simultané des applications Android et iOS.

## 📋 Table des Matières

1. [Choix Technologique](#choix-technologique)
2. [Architecture](#architecture)
3. [Setup Projet](#setup-projet)
4. [Features à Implémenter](#features-à-implémenter)
5. [Timeline](#timeline)
6. [Ressources](#ressources)

---

## 🎯 Choix Technologique

### React Native (Recommandé) ✅

**Pourquoi React Native ?**

- ✅ Un seul codebase pour Android + iOS (70% de code partagé)
- ✅ Performance proche du natif
- ✅ Hot reload (développement rapide)
- ✅ Large écosystème de packages
- ✅ Réutilisation de la logique métier (API, state)
- ✅ Team déjà familier avec React/Next.js

**Stack Recommandée** :
```
- React Native (latest)
- TypeScript
- React Navigation (navigation)
- Redux Toolkit ou Zustand (state management)
- React Query (data fetching)
- Stripe React Native (paiement)
- AsyncStorage (stockage local)
- react-native-vector-icons (icônes)
- React Native Paper ou NativeBase (UI components)
```

### Alternatives Considérées

**Flutter** :
- ❌ Nouveau langage (Dart)
- ❌ Team doit apprendre
- ✅ Performance excellente
- ✅ UI magnifique

**Native (Swift + Kotlin)** :
- ❌ 2 codebases séparés
- ❌ Double effort de développement
- ✅ Performance maximale
- ✅ Accès complet aux APIs natives

**Verdict** : React Native offre le meilleur ratio performance/temps de développement.

---

## 🏗️ Architecture

### Structure du Projet

```
nature-pharmacy-mobile/
├── src/
│   ├── screens/          # Écrans de l'app
│   │   ├── Auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── Home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── CategoryScreen.tsx
│   │   ├── Products/
│   │   │   ├── ProductListScreen.tsx
│   │   │   ├── ProductDetailScreen.tsx
│   │   │   └── SearchScreen.tsx
│   │   ├── Cart/
│   │   │   ├── CartScreen.tsx
│   │   │   └── CheckoutScreen.tsx
│   │   ├── Profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   ├── OrdersScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── Seller/
│   │       ├── SellerDashboard.tsx
│   │       ├── ProductManagement.tsx
│   │       └── PayoutScreen.tsx
│   ├── components/        # Composants réutilisables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── ProductFilter.tsx
│   │   └── cart/
│   │       ├── CartItem.tsx
│   │       └── CartSummary.tsx
│   ├── navigation/        # Configuration navigation
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── cart.service.ts
│   │   └── order.service.ts
│   ├── store/             # State management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── cartSlice.ts
│   │   │   └── userSlice.ts
│   │   └── store.ts
│   ├── hooks/             # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   ├── utils/             # Utilitaires
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── types/             # TypeScript types
│   │   ├── product.types.ts
│   │   ├── user.types.ts
│   │   └── order.types.ts
│   └── assets/            # Images, fonts, etc.
│       ├── images/
│       ├── icons/
│       └── fonts/
├── android/               # Config Android
├── ios/                   # Config iOS
├── App.tsx               # Point d'entrée
├── package.json
└── tsconfig.json
```

### Architecture Technique

```
┌─────────────────────────────────────┐
│      React Native App              │
│  (Android + iOS)                    │
└──────────────┬──────────────────────┘
               │
               │ HTTPS/REST API
               │
┌──────────────▼──────────────────────┐
│   Next.js Backend API               │
│   (API Routes existantes)           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   MongoDB Database                  │
└─────────────────────────────────────┘
```

**Principe** : L'app mobile consomme les mêmes API que le site web.

---

## 🚀 Setup Projet

### 1. Installation Environment

#### macOS (pour iOS + Android)

```bash
# 1. Installer Homebrew (si pas déjà fait)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Installer Node.js (si pas déjà fait)
brew install node

# 3. Installer Watchman
brew install watchman

# 4. Installer CocoaPods (pour iOS)
sudo gem install cocoapods

# 5. Installer Xcode (via App Store)
# Ouvrir Xcode une fois pour accepter la licence

# 6. Installer Android Studio
# Télécharger depuis: https://developer.android.com/studio
# Configurer Android SDK
```

#### Windows (pour Android uniquement)

```bash
# 1. Installer Node.js
# Télécharger depuis: https://nodejs.org

# 2. Installer Android Studio
# Télécharger depuis: https://developer.android.com/studio

# 3. Configurer Android SDK
# Dans Android Studio:
# - Tools → SDK Manager
# - Installer Android SDK Platform 33+
# - Installer Android SDK Build-Tools
# - Configurer ANDROID_HOME dans variables environnement
```

### 2. Créer le Projet React Native

```bash
# Aller dans le dossier parent
cd "c:\Users\pc\Nature Pharmacy"

# Créer le projet React Native avec TypeScript
npx react-native@latest init NaturePharmacyMobile --template react-native-template-typescript

# Entrer dans le projet
cd NaturePharmacyMobile
```

### 3. Installer les Dépendances

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated

# State Management
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query

# API & Network
npm install axios
npm install @react-native-async-storage/async-storage

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# Forms
npm install react-hook-form
npm install zod # validation

# Paiement
npm install @stripe/stripe-react-native

# Images
npm install react-native-fast-image

# Utils
npm install date-fns
npm install react-native-toast-message

# Development
npm install --save-dev @types/react-native-vector-icons
```

### 4. Configuration iOS (macOS uniquement)

```bash
cd ios
pod install
cd ..
```

### 5. Lancer l'App

```bash
# Android
npm run android

# iOS (macOS uniquement)
npm run ios
```

---

## 📱 Features à Implémenter

### Phase 1 : MVP (2-3 semaines)

#### 1. Authentification ✅
- [x] Écran Login
- [x] Écran Register
- [x] Forgot Password
- [x] Session management
- [x] Token storage (AsyncStorage)

#### 2. Navigation Home ✅
- [x] Bottom Tab Navigation
- [x] Home Screen
- [x] Categories
- [x] Search Bar

#### 3. Produits ✅
- [x] Liste produits
- [x] Filtres (catégorie, prix, etc.)
- [x] Détail produit
- [x] Images carousel
- [x] Avis produit

#### 4. Panier & Checkout ✅
- [x] Ajouter au panier
- [x] Modifier quantité
- [x] Supprimer du panier
- [x] Checkout flow
- [x] Adresse de livraison

#### 5. Paiement ✅
- [x] Intégration Stripe
- [x] Carte bancaire
- [x] PayPal (optionnel)

#### 6. Profil Utilisateur ✅
- [x] Mes informations
- [x] Mes commandes
- [x] Historique
- [x] Paramètres

### Phase 2 : Améliorations (2 semaines)

#### 7. Notifications Push 🔔
- [ ] Firebase Cloud Messaging (FCM)
- [ ] Notifications commande
- [ ] Promotions

#### 8. Fonctionnalités Vendeur 🏪
- [ ] Dashboard vendeur
- [ ] Gestion produits
- [ ] Gestion commandes
- [ ] Statistiques

#### 9. Social Features 👥
- [ ] Favoris/Wishlist
- [ ] Partage produits
- [ ] Avis et notes

#### 10. Offline Mode 📴
- [ ] Cache produits
- [ ] Panier offline
- [ ] Sync quand online

### Phase 3 : Polish (1 semaine)

#### 11. Performance 🚀
- [ ] Lazy loading images
- [ ] Pagination
- [ ] Optimisation bundle
- [ ] Code splitting

#### 12. UX/UI 🎨
- [ ] Animations
- [ ] Skeleton loaders
- [ ] Pull to refresh
- [ ] Dark mode

#### 13. Analytics 📊
- [ ] Google Analytics
- [ ] Crash reporting (Sentry)
- [ ] User behavior tracking

---

## 📅 Timeline Détaillé

### Semaine 1 : Setup & Infrastructure

**Jours 1-2** : Environment Setup
- Installation outils (Xcode, Android Studio)
- Création projet React Native
- Configuration TypeScript
- Setup navigation

**Jours 3-5** : Architecture & API
- Configuration Redux/React Query
- Services API (connexion backend)
- Types TypeScript
- Authentification token

**Jours 6-7** : UI Foundation
- Thème et couleurs
- Composants de base (Button, Input, Card)
- Layout responsive
- Icons et assets

### Semaine 2 : Core Features

**Jours 8-10** : Authentification
- Écran Login/Register
- Forgot Password
- Token management
- Protected routes

**Jours 11-14** : Produits & Navigation
- Home screen
- Liste produits
- Filtres et recherche
- Détail produit
- Categories

### Semaine 3 : E-commerce Features

**Jours 15-17** : Panier
- Ajouter/Modifier/Supprimer
- Calcul totaux
- Checkout flow
- Adresse livraison

**Jours 18-21** : Paiement
- Intégration Stripe
- Formulaire paiement
- Confirmation commande
- Historique commandes

### Semaine 4 : Profil & Polish

**Jours 22-24** : Profil Utilisateur
- Page profil
- Mes commandes
- Paramètres
- Édition infos

**Jours 25-28** : Tests & Déploiement
- Tests fonctionnels
- Fix bugs
- Build release Android
- Build release iOS

### Semaines 5-6 : Améliorations (optionnel)

- Notifications push
- Features vendeur
- Social features
- Performance optimizations

---

## 🎨 Design System

### Couleurs (reprendre du web)

```typescript
// src/utils/theme.ts
export const colors = {
  primary: '#10B981',      // Green
  secondary: '#059669',
  accent: '#34D399',

  background: '#FFFFFF',
  surface: '#F9FAFB',

  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },

  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',

  border: '#E5E7EB',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
  },
};
```

### Composants Réutilisables

Créer des composants alignés avec le web :
- `Button` (primary, secondary, outline)
- `Input` (text, email, password)
- `Card` (produit, commande)
- `Badge` (status)
- `Loading` (spinner, skeleton)

---

## 🔌 Intégration Backend

### Configuration API

```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://votre-domaine.com';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour ajouter le token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expiré, déconnecter
      await AsyncStorage.removeItem('authToken');
      // Rediriger vers login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Services API

```typescript
// src/services/product.service.ts
import api from './api';

export const productService = {
  getProducts: async (params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  searchProducts: async (query: string) => {
    const response = await api.get('/products/search', {
      params: { q: query },
    });
    return response.data;
  },
};
```

**Important** : Toutes les API routes du backend Next.js sont déjà prêtes, il suffit de les consommer !

---

## 📦 Build & Déploiement

### Android

#### 1. Générer la clé de signature

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore nature-pharmacy.keystore -alias nature-pharmacy -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Configurer Gradle

```gradle
// android/app/build.gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('nature-pharmacy.keystore')
            storePassword 'votre_password'
            keyAlias 'nature-pharmacy'
            keyPassword 'votre_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 3. Build Release

```bash
cd android
./gradlew assembleRelease
# APK généré dans: android/app/build/outputs/apk/release/app-release.apk
```

#### 4. Publier sur Google Play

- Créer compte Google Play Developer (25$ one-time)
- Créer l'application
- Upload APK ou AAB
- Remplir les informations (description, screenshots)
- Soumettre pour review

### iOS

#### 1. Configurer Xcode

```bash
cd ios
open NaturePharmacyMobile.xcworkspace
```

#### 2. Configuration

- Sélectionner Team (Apple Developer)
- Configurer Bundle Identifier
- Sélectionner provisioning profile

#### 3. Build Release

- Product → Archive
- Distribute App
- Upload to App Store Connect

#### 4. Publier sur App Store

- Créer compte Apple Developer (99$/an)
- App Store Connect → Nouvelle app
- Remplir métadonnées
- Upload build depuis Xcode
- Soumettre pour review

---

## 🧪 Tests

### Tests Unitaires

```bash
npm install --save-dev jest @testing-library/react-native
```

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button onPress={onPress}>Click me</Button>
    );
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### Tests E2E (Detox)

```bash
npm install --save-dev detox
```

---

## 📚 Ressources Utiles

### Documentation Officielle
- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Stripe React Native](https://stripe.com/docs/mobile/react-native)

### Tutoriels Recommandés
- [React Native Tutorial (officiel)](https://reactnative.dev/docs/tutorial)
- [Building E-commerce App](https://www.youtube.com/results?search_query=react+native+ecommerce+app)

### Outils
- [Expo Snack](https://snack.expo.dev/) - Playground en ligne
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/) - Debugging tool

### Packages Utiles
- [react-native-paper](https://reactnativepaper.com/) - Material Design
- [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons)
- [react-native-fast-image](https://github.com/DylanVann/react-native-fast-image)
- [react-native-image-picker](https://github.com/react-native-image-picker/react-native-image-picker)

---

## ✅ Checklist de Lancement

### Avant Release

- [ ] Toutes les features MVP implémentées
- [ ] Tests unitaires passent
- [ ] Tests E2E passent
- [ ] Build release Android réussit
- [ ] Build release iOS réussit (si macOS)
- [ ] App testée sur devices réels (3+ devices)
- [ ] Crashlytics configuré
- [ ] Analytics configuré
- [ ] Push notifications configurées
- [ ] Deep links configurés
- [ ] Privacy Policy dans l'app
- [ ] Terms of Service dans l'app
- [ ] Screenshots pour stores (5+ par plateforme)
- [ ] Description app (FR/EN)
- [ ] Icône app (1024x1024)

### Google Play

- [ ] Compte Developer créé (25$)
- [ ] App créée dans Console
- [ ] APK/AAB uploadé
- [ ] Métadonnées remplies
- [ ] Screenshots ajoutés
- [ ] Content rating complété
- [ ] Pricing défini (gratuit)
- [ ] Soumis pour review

### App Store

- [ ] Compte Developer créé (99$/an)
- [ ] App créée dans App Store Connect
- [ ] Build uploadé
- [ ] Métadonnées remplies
- [ ] Screenshots ajoutés
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] Soumis pour review

---

## 🎯 Métriques de Succès

### KPIs à Tracker

**Téléchargements** :
- Nombre de downloads
- Taux de rétention J1, J7, J30
- Croissance mensuelle

**Engagement** :
- Sessions quotidiennes/utilisateur
- Durée moyenne session
- Écrans les plus visités
- Taux d'abandon panier

**Conversion** :
- Taux de conversion visiteur → acheteur
- Valeur moyenne commande
- Nombre de commandes/utilisateur

**Performance** :
- Temps de chargement écrans
- Crash rate (< 1%)
- ANR rate Android (< 0.5%)

### Outils Analytics

- **Firebase Analytics** (gratuit, recommandé)
- **Google Analytics for Mobile**
- **Mixpanel** (avancé, payant)
- **Amplitude** (product analytics)

---

## 🚀 Prochaines Étapes

1. **Setup environment** (Xcode, Android Studio)
2. **Créer projet React Native**
3. **Configurer navigation & état**
4. **Implémenter écran Login**
5. **Connecter à l'API backend**
6. **Itérer sur les features**

Bonne chance pour le développement mobile ! 📱🚀
