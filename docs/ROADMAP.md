# Roadmap Nature Pharmacy - Web & Mobile

Ce document détaille les fonctionnalités restantes à implémenter pour la plateforme web, puis la stratégie pour les applications mobiles.

---

## 📱 Table des Matières

1. [Plateforme Web - À Faire](#plateforme-web---à-faire)
2. [Applications Mobile - Stratégie](#applications-mobile---stratégie)
3. [Planning Suggéré](#planning-suggéré)

---

# 🌐 Plateforme Web - À Faire

## 1. Pages Légales & Informatives

### Mentions Légales & CGV
- [ ] **Créer page Mentions Légales**
  - Fichier: `app/[locale]/legal/page.tsx`
  - Informations entreprise (nom, siège social, SIRET, etc.)
  - Directeur de publication
  - Hébergeur
  - Propriété intellectuelle

- [ ] **Créer page CGV (Conditions Générales de Vente)**
  - Fichier: `app/[locale]/terms-of-sale/page.tsx`
  - Article 1 : Objet
  - Article 2 : Prix
  - Article 3 : Commandes
  - Article 4 : Livraison
  - Article 5 : Droit de rétractation (14 jours)
  - Article 6 : Garanties
  - Article 7 : Responsabilité
  - Article 8 : Données personnelles
  - Article 9 : Droit applicable

- [ ] **Créer page Politique de Confidentialité**
  - Fichier: `app/[locale]/privacy/page.tsx`
  - Collecte de données
  - Utilisation des données
  - Cookies
  - Droits des utilisateurs (RGPD)
  - Contact DPO

- [ ] **Créer page Conditions d'Utilisation**
  - Fichier: `app/[locale]/terms-of-use/page.tsx`
  - Utilisation du site
  - Compte utilisateur
  - Contenu utilisateur
  - Limitation de responsabilité

- [ ] **Créer page Politique de Cookies**
  - Fichier: `app/[locale]/cookies/page.tsx`
  - Types de cookies utilisés
  - Gestion des cookies
  - Banner de consentement cookies

### Pages Informatives

- [ ] **Améliorer page À Propos**
  - Fichier: `app/[locale]/about/page.tsx` (si existe, sinon créer)
  - Histoire de Nature Pharmacy
  - Mission et valeurs
  - Équipe (optionnel)
  - Certifications et labels

- [ ] **Créer page Contact**
  - Fichier: `app/[locale]/contact/page.tsx`
  - Formulaire de contact
  - Email de contact
  - Téléphone (optionnel)
  - Horaires de réponse
  - FAQ rapide

- [ ] **Créer page FAQ**
  - Fichier: `app/[locale]/faq/page.tsx`
  - Accordéon pour questions/réponses
  - Catégories : Commande, Livraison, Paiement, Produits, Compte
  - Minimum 15-20 questions

- [ ] **Créer page Livraison & Retours**
  - Fichier: `app/[locale]/shipping-returns/page.tsx`
  - Zones de livraison
  - Délais de livraison
  - Frais de port
  - Politique de retour
  - Procédure de retour

---

## 2. Fonctionnalités Utilisateur

### Compte Client

- [ ] **Page Profil Utilisateur Complète**
  - Fichier: `app/[locale]/account/profile/page.tsx`
  - Modifier informations personnelles
  - Changer mot de passe
  - Préférences de langue
  - Photo de profil (optionnel)
  - Supprimer compte

- [ ] **Liste de Souhaits (Wishlist)**
  - Déjà implémenté : `components/wishlist/WishlistButton.tsx`
  - [ ] Créer page liste complète : `app/[locale]/account/wishlist/page.tsx`
  - Voir tous les produits en wishlist
  - Supprimer de la wishlist
  - Ajouter au panier depuis wishlist
  - Partager la wishlist

- [ ] **Adresses de Livraison Multiples**
  - Fichier: `app/[locale]/account/addresses/page.tsx`
  - Ajouter/modifier/supprimer des adresses
  - Définir adresse par défaut
  - Sélectionner lors du checkout

- [ ] **Moyens de Paiement Sauvegardés**
  - Fichier: `app/[locale]/account/payment-methods/page.tsx`
  - Sauvegarder cartes (via Stripe)
  - Gérer les cartes enregistrées
  - Sélection rapide au checkout

- [ ] **Programme de Fidélité (Optionnel)**
  - Model: `models/LoyaltyProgram.ts`
  - Points gagnés par achat
  - Récompenses et réductions
  - Historique des points
  - Page: `app/[locale]/account/loyalty/page.tsx`

### Avis & Reviews

- [ ] **Système de Notation Produits**
  - Déjà partiellement implémenté : `components/products/ProductReviews.tsx`
  - [ ] Permettre upload de photos dans les avis
  - [ ] Avis vérifiés (achat confirmé)
  - [ ] Réponse du vendeur aux avis
  - [ ] Filtrer avis par note
  - [ ] Utile/Pas utile sur les avis

- [ ] **Avis sur les Vendeurs**
  - Notation vendeur après achat
  - Critères : Communication, Rapidité, Qualité
  - Afficher sur page vendeur

### Notifications

- [ ] **Centre de Notifications**
  - Fichier: `app/[locale]/account/notifications/page.tsx`
  - Liste des notifications
  - Marquer comme lu
  - Préférences de notifications
  - Types : Commande, Message, Promo, Blog

- [ ] **Notifications en Temps Réel (Optionnel)**
  - Implémenter WebSocket ou Server-Sent Events
  - Notification instantanée des messages
  - Notification statut commande
  - Badge de notification dans header

---

## 3. Fonctionnalités E-commerce

### Checkout & Paiement

- [ ] **Améliorer Processus de Checkout**
  - Fichier: `app/[locale]/checkout/page.tsx`
  - [ ] Checkout en plusieurs étapes claires
    1. Adresse de livraison
    2. Mode de livraison
    3. Paiement
    4. Confirmation
  - [ ] Sauvegarder panier pour utilisateur connecté
  - [ ] Récupération panier abandonné
  - [ ] Code promo au checkout
  - [ ] Calcul automatique des frais de port
  - [ ] Résumé commande toujours visible

- [ ] **Méthodes de Paiement Supplémentaires**
  - [ ] Intégration Stripe complète
  - [ ] Intégration PayPal
  - [ ] Virement bancaire (optionnel)
  - [ ] Paiement à la livraison (optionnel)
  - Sélection dans Admin → Settings → Payment Methods

- [ ] **Page Confirmation de Commande**
  - Fichier: `app/[locale]/checkout/success/page.tsx`
  - Numéro de commande
  - Récapitulatif
  - Bouton voir la commande
  - Email de confirmation envoyé

### Promotions & Marketing

- [ ] **Codes Promo Avancés**
  - Déjà implémenté partiellement : `models/Coupon.ts`
  - [ ] Appliquer au checkout
  - [ ] Validation côté serveur
  - [ ] Types : Pourcentage, Montant fixe, Livraison gratuite
  - [ ] Conditions : Montant minimum, Première commande, Produits spécifiques

- [ ] **Ventes Flash**
  - Model: Extension de `Product` ou nouveau `FlashSale`
  - Durée limitée
  - Compte à rebours
  - Stock limité
  - Badge "Vente Flash" sur produit

- [ ] **Programme de Parrainage**
  - Model: `models/Referral.ts`
  - Code parrain unique par utilisateur
  - Réduction parrain + filleul
  - Suivi des parrainages
  - Page: `app/[locale]/account/referrals/page.tsx`

- [ ] **Newsletter**
  - Formulaire d'inscription (footer existe déjà)
  - [ ] Créer model `Newsletter.ts`
  - [ ] API route pour inscription
  - [ ] Page de confirmation
  - [ ] Désabonnement facile
  - [ ] Intégration avec service email (Mailchimp, SendGrid)

### Recherche & Filtres

- [ ] **Recherche Avancée**
  - Déjà implémenté : recherche de base
  - [ ] Suggestions de recherche (autocomplete)
  - [ ] Recherche par mots-clés multiples
  - [ ] Recherche phonétique (FR)
  - [ ] Historique de recherche

- [ ] **Filtres Avancés Produits**
  - Déjà implémenté : filtres de base
  - [ ] Filtres combinés (ET/OU)
  - [ ] Sauvegarde de filtres favoris
  - [ ] URL avec filtres (partageables)
  - [ ] Nombre de résultats par filtre

- [ ] **Tri Produits**
  - Déjà implémenté partiellement
  - [ ] Pertinence
  - [ ] Prix croissant/décroissant
  - [ ] Nouveautés
  - [ ] Meilleures ventes
  - [ ] Meilleures notes
  - [ ] Nom A-Z / Z-A

---

## 4. Fonctionnalités Vendeur

### Tableau de Bord Vendeur

- [ ] **Dashboard Vendeur Amélioré**
  - Fichier: `app/[locale]/seller/dashboard/page.tsx`
  - [ ] Statistiques de vente (graphiques)
  - [ ] Revenus du mois
  - [ ] Produits les plus vendus
  - [ ] Commandes en attente
  - [ ] Avis récents

- [ ] **Gestion Stock Avancée**
  - [ ] Alertes stock faible
  - [ ] Historique des variations de stock
  - [ ] Import/Export CSV stock
  - [ ] Gestion des variantes (taille, couleur) si nécessaire

- [ ] **Gestion des Promotions Vendeur**
  - Le vendeur peut créer ses propres promotions
  - Réductions sur ses produits
  - Validation admin (optionnel)

- [ ] **Rapports & Analytics Vendeur**
  - Fichier: `app/[locale]/seller/analytics/page.tsx`
  - Ventes par période
  - Produits populaires
  - Taux de conversion
  - Export PDF/Excel

### Communication Vendeur

- [ ] **Améliorer Messagerie**
  - Déjà implémenté : base de messagerie
  - [ ] Notification email nouveau message
  - [ ] Pièces jointes
  - [ ] Messages groupés (plusieurs acheteurs)
  - [ ] Templates de réponses rapides

- [ ] **Page Vendeur Publique**
  - Fichier: `app/[locale]/seller/[id]/page.tsx`
  - Profil vendeur
  - Liste des produits du vendeur
  - Avis vendeur
  - Bouton contact vendeur
  - Statistiques publiques (note, ventes)

---

## 5. Admin - Fonctionnalités Manquantes

### Gestion Avancée

- [ ] **Gestion des Retours**
  - Model: `models/Return.ts`
  - Page admin: `app/[locale]/admin/returns/page.tsx`
  - Demande de retour client
  - Statut : En attente, Approuvé, Refusé, Remboursé
  - Raison du retour
  - Remboursement automatique ou manuel

- [ ] **Gestion des Réclamations**
  - Model: `models/Complaint.ts`
  - Page admin: `app/[locale]/admin/complaints/page.tsx`
  - Type : Produit, Livraison, Service
  - Statut : Ouvert, En cours, Résolu, Fermé
  - Attribution à un admin

- [ ] **Logs & Audit Trail**
  - Model: `models/AuditLog.ts`
  - Enregistrer actions importantes :
    - Modification de commande
    - Suppression de produit
    - Changement de rôle utilisateur
  - Page: `app/[locale]/admin/logs/page.tsx`
  - Filtres par utilisateur, action, date

- [ ] **Gestion des Taxes**
  - Model: `models/Tax.ts` ou extension de `Settings`
  - TVA par pays/région
  - Calcul automatique au checkout
  - Affichage TTC/HT

- [ ] **Gestion des Devises Multiples**
  - Déjà partiellement implémenté : `contexts/CurrencyContext.tsx`
  - [ ] Taux de change automatiques (API)
  - [ ] Configuration admin
  - [ ] Conversion temps réel

### Reports & Analytics

- [ ] **Dashboard Analytics Amélioré**
  - Déjà implémenté : base analytics
  - [ ] Graphiques interactifs (Chart.js, Recharts)
  - [ ] Export des rapports (PDF, Excel)
  - [ ] Comparaison périodes
  - [ ] Prévisions de vente (basique)

- [ ] **Rapports Personnalisés**
  - Page: `app/[locale]/admin/reports/page.tsx`
  - Ventes par produit
  - Ventes par catégorie
  - Ventes par vendeur
  - Ventes par région
  - Clients top acheteurs

---

## 6. Optimisations & Améliorations

### Performance

- [ ] **Optimisation Images**
  - Utiliser Next.js Image component partout
  - Format WebP
  - Lazy loading
  - Blur placeholder

- [ ] **Caching**
  - [ ] Cache API routes (Next.js revalidation)
  - [ ] Cache produits populaires
  - [ ] CDN pour images statiques

- [ ] **Pagination Améliorée**
  - Load more (infinite scroll)
  - Ou pagination classique
  - SEO-friendly URLs

### UX/UI

- [ ] **Mode Sombre (Dark Mode)**
  - Toggle dans header ou settings
  - Sauvegarder préférence
  - Design cohérent

- [ ] **Animations & Transitions**
  - Micro-interactions
  - Loading skeletons
  - Page transitions

- [ ] **Accessibilité (A11y)**
  - [ ] ARIA labels
  - [ ] Navigation clavier
  - [ ] Contraste couleurs (WCAG AA)
  - [ ] Screen reader friendly
  - Test avec Lighthouse

- [ ] **PWA (Progressive Web App)**
  - Service Worker
  - Offline mode basique
  - Installable
  - Manifest.json

### Internationalization

- [ ] **Traductions Complètes**
  - Vérifier toutes les pages FR/EN/ES
  - Blog traduit
  - Emails traduits
  - Messages d'erreur traduits

- [ ] **Détection Auto de Langue**
  - Basée sur navigateur
  - Basée sur géolocalisation IP
  - Sélecteur de langue dans header

---

## 7. Intégrations Tierces

### Email Marketing

- [ ] **Mailchimp / SendGrid**
  - Synchroniser newsletter
  - Campagnes email automatiques
  - Panier abandonné
  - Recommandations produits

### Analytics & Tracking

- [ ] **Google Analytics 4**
  - Installation du code
  - Events de conversion
  - E-commerce tracking

- [ ] **Facebook Pixel** (Optionnel)
  - Tracking conversions
  - Remarketing

- [ ] **Hotjar / Microsoft Clarity** (Optionnel)
  - Heatmaps
  - Session recordings
  - User feedback

### Support Client

- [ ] **Chat en Direct**
  - Intercom, Tawk.to, Crisp
  - Ou solution custom
  - Disponibilité heures ouvrées

- [ ] **Système de Tickets**
  - Déjà partiellement implémenté : `models/Ticket.ts`
  - [ ] Interface client pour créer ticket
  - [ ] Suivi de ticket
  - [ ] Réponses par email

### Réseaux Sociaux

- [ ] **Partage Social**
  - Déjà implémenté : `components/social/ShareButtons.tsx`
  - [ ] Vérifier sur toutes pages produits
  - [ ] Partage articles blog
  - [ ] Méta tags Open Graph (fait)

- [ ] **Login Social**
  - Google OAuth
  - Facebook Login
  - Via NextAuth providers

---

## 8. Sécurité & Conformité

### RGPD

- [ ] **Consentement Cookies**
  - Banner cookies
  - Gestion préférences
  - Cookie policy

- [ ] **Droit à l'Oubli**
  - Supprimer compte utilisateur
  - Anonymisation des données
  - Export données personnelles (GDPR)

- [ ] **Double Opt-in Email**
  - Déjà implémenté : vérification email
  - [ ] Pour newsletter aussi

### Sécurité Avancée

- [ ] **Rate Limiting**
  - Limiter requêtes API
  - Protection brute force
  - Par IP ou par user

- [ ] **2FA (Two-Factor Auth)**
  - Via email ou SMS
  - Via app (Google Authenticator)
  - Optionnel pour utilisateurs

- [ ] **Captcha**
  - Sur formulaires publics
  - Google reCAPTCHA v3
  - Login, inscription, contact

---

## 9. Tests & Qualité

### Tests Automatisés

- [ ] **Tests Unitaires**
  - Fonctions utilitaires
  - Composants React (Jest + React Testing Library)
  - Couverture > 70%

- [ ] **Tests d'Intégration**
  - API routes
  - Parcours utilisateur
  - Cypress ou Playwright

- [ ] **Tests E2E**
  - Parcours complet commande
  - Connexion/inscription
  - Admin dashboard

### Documentation

- [ ] **Documentation Développeur**
  - Architecture du projet
  - Guide de contribution
  - API documentation
  - Composants Storybook (optionnel)

- [ ] **Documentation Utilisateur**
  - Guide d'utilisation admin
  - Guide vendeur
  - Guide client
  - Tutoriels vidéo (optionnel)

---

# 📱 Applications Mobile - Stratégie

## Approches Possibles

### Option 1 : Progressive Web App (PWA) ⭐ RECOMMANDÉ

**Avantages :**
- Utilise le site web existant
- Une seule codebase (Next.js)
- Installation sur téléphone
- Notifications push
- Mode offline
- Mise à jour instantanée
- Coût minimal

**Inconvénients :**
- Pas dans App Store / Play Store (mais installable)
- Fonctionnalités natives limitées
- Performance légèrement inférieure

**Implémentation :**
- [ ] Créer `manifest.json`
- [ ] Service Worker pour cache
- [ ] Optimiser UI pour mobile
- [ ] Push notifications
- [ ] Offline mode basique

**Effort : 1-2 semaines**

---

### Option 2 : React Native (Expo) ⭐⭐ RECOMMANDÉ SI BUDGET

**Avantages :**
- Apps natives iOS + Android
- Partage de code avec web (React)
- Performance native
- Accès API natives (caméra, GPS, etc.)
- Dans les stores officiels
- Expo simplifie beaucoup

**Inconvénients :**
- Nouvelle codebase à maintenir
- Temps de développement plus long
- Coût plus élevé
- Besoin de comptes développeur Apple/Google

**Stack Technique :**
```
- React Native (Expo)
- TypeScript
- React Navigation
- AsyncStorage
- Axios (API calls)
- Redux ou Zustand (state)
```

**Fonctionnalités Prioritaires :**
1. Authentification
2. Catalogue produits
3. Recherche et filtres
4. Panier
5. Checkout
6. Commandes
7. Profil utilisateur
8. Notifications push
9. Messagerie
10. Scanner code-barres (optionnel)

**Effort : 2-3 mois**

---

### Option 3 : Flutter

**Avantages :**
- Performance excellente
- UI magnifique
- Hot reload
- Une codebase pour iOS + Android + Web

**Inconvénients :**
- Langage Dart (nouveau à apprendre)
- Moins de partage avec Next.js web
- Communauté plus petite que React

**Effort : 2-3 mois + apprentissage Dart**

---

### Option 4 : Apps Natives (Swift + Kotlin)

**Avantages :**
- Performance maximale
- Accès total aux API natives
- UI/UX optimale par plateforme

**Inconvénients :**
- Deux codebases séparées
- Temps de développement x2
- Coût très élevé
- Besoin de 2 développeurs (iOS + Android)

**Effort : 4-6 mois + 2 développeurs**

---

## Recommandation : Approche Progressive

### Phase 1 : PWA (Immédiat - 2 semaines)
- Convertir le site web actuel en PWA
- Installer sur mobile
- Mode offline basique
- Notifications push web
- **Avantage** : Déploiement immédiat

### Phase 2 : React Native (3-6 mois)
- Développer app native
- Publier sur stores
- Fonctionnalités avancées
- **Avantage** : Meilleure expérience utilisateur

---

## 📋 Checklist App Mobile React Native

Si vous choisissez React Native, voici les étapes :

### Setup Initial
- [ ] Installer Expo CLI
- [ ] Créer nouveau projet Expo
  ```bash
  npx create-expo-app nature-pharmacy-mobile
  ```
- [ ] Configurer TypeScript
- [ ] Setup Git repository
- [ ] Configurer ESLint + Prettier

### Architecture
- [ ] Structure des dossiers
  ```
  /src
    /screens
    /components
    /navigation
    /services (API)
    /store (state management)
    /utils
    /hooks
    /types
    /constants
  ```
- [ ] Navigation (React Navigation)
- [ ] State management (Redux Toolkit ou Zustand)
- [ ] API client (Axios + interceptors)

### Authentification
- [ ] Écran Login
- [ ] Écran Inscription
- [ ] Écran Mot de passe oublié
- [ ] Vérification email
- [ ] Stockage token (SecureStore)
- [ ] Auto-login
- [ ] Biométrie (Face ID / Touch ID)

### Écrans Principaux

**Onboarding**
- [ ] Splash screen
- [ ] Walkthrough (première utilisation)
- [ ] Sélection langue

**Home**
- [ ] Écran accueil
- [ ] Catégories
- [ ] Produits featured
- [ ] Recherche
- [ ] Bannières promo

**Produits**
- [ ] Liste produits
- [ ] Filtres bottom sheet
- [ ] Tri
- [ ] Détail produit
- [ ] Galerie images (swipe)
- [ ] Avis
- [ ] Produits similaires

**Panier**
- [ ] Liste panier
- [ ] Modifier quantité
- [ ] Supprimer article
- [ ] Résumé prix
- [ ] Codes promo

**Checkout**
- [ ] Adresse livraison
- [ ] Mode de livraison
- [ ] Paiement (Stripe SDK)
- [ ] Confirmation

**Compte**
- [ ] Profil utilisateur
- [ ] Commandes
- [ ] Adresses
- [ ] Moyens de paiement
- [ ] Wishlist
- [ ] Settings
- [ ] Déconnexion

**Messagerie**
- [ ] Liste conversations
- [ ] Chat screen
- [ ] Notifications messages

**Vendeur** (si applicable)
- [ ] Dashboard vendeur
- [ ] Mes produits
- [ ] Commandes
- [ ] Statistiques

### Fonctionnalités Natives

- [ ] **Notifications Push**
  - Expo Notifications
  - Token registration
  - Gestion des permissions
  - Deep linking

- [ ] **Caméra**
  - Scanner code-barres produit
  - Upload photo profil
  - Photo avis produit

- [ ] **Localisation**
  - Trouver vendeurs proches
  - Calcul frais de port

- [ ] **Partage**
  - Partager produit
  - Partager code parrain

- [ ] **Offline Mode**
  - Cache produits vus
  - Queue actions (sync later)

### Intégrations

- [ ] API Backend (Next.js)
- [ ] Stripe SDK
- [ ] Google Analytics
- [ ] Crashlytics
- [ ] In-App Purchase (optionnel)

### Tests

- [ ] Tests unitaires (Jest)
- [ ] Tests composants (Testing Library)
- [ ] Tests E2E (Detox)

### Build & Déploiement

- [ ] **iOS**
  - Apple Developer Account (99$/an)
  - Certificats & Provisioning Profiles
  - TestFlight (beta testing)
  - App Store submission

- [ ] **Android**
  - Google Play Developer Account (25$ one-time)
  - Keystore generation
  - Google Play Console
  - Internal testing → Production

- [ ] **Over-The-Air Updates**
  - Expo Updates
  - Mises à jour sans passer par stores

---

# 📅 Planning Suggéré

## Phase 1 : Compléter le Web (4-6 semaines)

### Semaine 1-2 : Pages Essentielles
- [ ] Pages légales (CGV, Confidentialité, Mentions)
- [ ] Page Contact + FAQ
- [ ] Améliorer page À propos

### Semaine 3-4 : Fonctionnalités E-commerce
- [ ] Checkout amélioré
- [ ] Codes promo au checkout
- [ ] Gestion retours admin
- [ ] Newsletter

### Semaine 5-6 : Polish & Tests
- [ ] Optimisations performance
- [ ] Tests complets
- [ ] Corrections bugs
- [ ] Documentation

## Phase 2 : PWA (1-2 semaines)

### Semaine 7-8 : Conversion PWA
- [ ] Manifest.json
- [ ] Service Worker
- [ ] Notifications push web
- [ ] Mode offline
- [ ] Tests PWA

## Phase 3 : Préparation Production (1-2 semaines)

### Semaine 9-10 : Production Ready
- [ ] Configuration production (voir PRODUCTION_CHECKLIST.md)
- [ ] SEO final
- [ ] Contenu (produits, blog)
- [ ] Tests finaux
- [ ] **LANCEMENT WEB** 🚀

## Phase 4 : Apps Natives (3-4 mois) - OPTIONNEL

### Mois 1 : Setup & Auth
- Setup React Native
- Architecture
- Authentification

### Mois 2 : Écrans Principaux
- Home, Produits, Panier
- Checkout
- Profil

### Mois 3 : Fonctionnalités Avancées
- Messagerie
- Notifications
- Offline mode
- Vendeur

### Mois 4 : Tests & Déploiement
- Tests complets
- Beta testing
- Soumission stores
- **LANCEMENT MOBILE** 🚀

---

## 🎯 Priorités Recommandées

### CRITIQUE (Avant lancement web)
1. Pages légales (CGV, Confidentialité)
2. Checkout fonctionnel avec paiement
3. Email notifications opérationnels
4. SEO finalisé
5. Tests complets

### IMPORTANT (Semaines après lancement)
6. Newsletter
7. Codes promo
8. Gestion retours
9. Analytics détaillés
10. PWA

### SOUHAITABLE (Mois 2-3)
11. Programme fidélité
12. Chat en direct
13. Apps mobiles natives
14. Fonctionnalités avancées

---

## 💰 Estimation Budget Apps Mobile

### PWA
- Développement : **Gratuit** (déjà inclus dans Next.js)
- Hébergement : Inclus Vercel
- **Total : 0€**

### React Native (Expo)
- Développement : 2-3 mois × taux horaire
- Apple Developer : 99€/an
- Google Play : 25€ (one-time)
- **Total : 15-30k€** (selon développeur)

### Natives (Swift + Kotlin)
- Développement : 4-6 mois × 2 développeurs
- Comptes développeur : 124€
- **Total : 40-80k€**

---

## 📞 Prochaines Étapes

1. **Valider les priorités** pour la plateforme web
2. **Choisir l'approche mobile** (PWA → React Native recommandé)
3. **Planifier le développement** selon budget et deadline
4. **Commencer par les pages légales** (obligatoire)

Vous voulez qu'on commence par quoi ? 🚀
