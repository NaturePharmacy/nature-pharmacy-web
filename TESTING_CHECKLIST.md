# 🧪 Checklist de Tests - Nature Pharmacy

## ✅ Préparation de l'environnement de test

### 1. Vérifier que tout est configuré
- [ ] MongoDB est démarré
- [ ] Variables d'environnement configurées (.env.local)
- [ ] Dépendances installées (`npm install`)
- [ ] Serveur de développement lancé (`npm run dev`)

### 2. Créer des données de test

#### Utilisateurs de test à créer :
1. **Admin** : admin@test.com / password123
2. **Vendeur** : seller@test.com / password123
3. **Acheteur** : buyer@test.com / password123

#### Produits de test :
- Exécuter le script de seed : `npm run seed:products`

---

## 📋 TESTS FONCTIONNELS

### 🔐 Module Authentification

#### Inscription (Register)
- [ ] Inscription acheteur réussie
- [ ] Inscription vendeur réussie
- [ ] Validation des champs requis
- [ ] Email déjà existant → erreur appropriée
- [ ] Mot de passe faible → erreur appropriée
- [ ] Code de parrainage valide → lien créé
- [ ] Code de parrainage invalide → erreur affichée
- [ ] Acceptation des conditions obligatoire

#### Connexion (Login)
- [ ] Connexion avec email/password valides
- [ ] Connexion échoue avec mauvais credentials
- [ ] Redirection vers dashboard selon le rôle
- [ ] Message d'erreur clair si échec

#### Déconnexion
- [ ] Bouton de déconnexion visible dans le menu dropdown
- [ ] Déconnexion fonctionne (desktop)
- [ ] Déconnexion fonctionne (mobile)
- [ ] Redirection vers page d'accueil après déconnexion

---

### 🏠 Pages Publiques

#### Page d'accueil (/)
- [ ] Logo affiché correctement (h-14)
- [ ] Hero section avec CTA
- [ ] Produits vedettes affichés
- [ ] Catégories affichées
- [ ] Footer complet avec tous les liens
- [ ] Responsive (mobile/tablette/desktop)

#### Navigation
- [ ] Toutes les catégories s'affichent
- [ ] Liens "Ventes Flash" → /deals
- [ ] Lien "Nouveautés" fonctionne
- [ ] Lien "Bio" fonctionne
- [ ] Recherche fonctionne
- [ ] Changement de langue fonctionne (FR/EN/ES)

#### Pages du Footer (toutes doivent s'afficher sans 404)
- [ ] /about - À propos
- [ ] /contact - Nous contacter
- [ ] /careers - Carrières
- [ ] /seller/guide - Guide vendeur
- [ ] /shipping - Livraison
- [ ] /returns - Retours
- [ ] /terms - Conditions d'utilisation
- [ ] /privacy - Politique de confidentialité
- [ ] /cookies - Politique cookies

#### Pages produits
- [ ] /products - Liste des produits
- [ ] /products/[id] - Détail produit
- [ ] /deals - Ventes flash (produits avec réduction)
- [ ] Images produits s'affichent
- [ ] Prix affichés correctement
- [ ] Stock affiché

---

### 🛒 Module E-commerce

#### Panier (Cart)
- [ ] Ajouter un produit au panier
- [ ] Modifier la quantité
- [ ] Supprimer un produit
- [ ] Compteur panier mis à jour dans le header
- [ ] Total calculé correctement
- [ ] Panier persiste après rafraîchissement
- [ ] Bouton "Passer commande" visible

#### Wishlist (Liste de souhaits)
- [ ] Ajouter un produit à la wishlist
- [ ] Retirer un produit de la wishlist
- [ ] Icône cœur change d'état
- [ ] Page /wishlist affiche tous les produits

#### Checkout (Paiement)
- [ ] Page checkout accessible depuis le panier
- [ ] Formulaire d'adresse fonctionne
- [ ] Application d'un code promo
- [ ] Sélection du mode de livraison
- [ ] Calcul des frais de livraison
- [ ] Récapitulatif de commande correct
- [ ] Bouton de paiement visible
- [ ] Création de commande réussie

#### Commandes (Orders)
- [ ] Liste des commandes affichée (/orders)
- [ ] Détails d'une commande (/orders/[id])
- [ ] Statut de commande affiché
- [ ] Suivi de livraison visible
- [ ] Historique des statuts

---

### 👤 Espace Utilisateur (Buyer)

#### Page Account (/account)
- [ ] Informations profil affichées
- [ ] Modification du profil fonctionne
- [ ] Modification de l'adresse
- [ ] Quick links vers Orders, Wishlist, Loyalty, Referral
- [ ] Upload photo de profil (si implémenté)

#### Programme de fidélité (/loyalty)
- [ ] Points affichés correctement
- [ ] Historique des points
- [ ] Récompenses disponibles
- [ ] Utilisation des points

#### Programme de parrainage (/referral)
- [ ] Code de parrainage affiché
- [ ] Lien de parrainage copiable
- [ ] Liste des personnes parrainées
- [ ] Récompenses de parrainage affichées
- [ ] Commissions calculées (5%)

#### Support Client (/support)
- [ ] Créer un nouveau ticket
- [ ] Liste des tickets
- [ ] Répondre à un ticket
- [ ] Statut du ticket mis à jour

---

### 🏪 Espace Vendeur (Seller)

#### Dashboard Vendeur (/seller)
- [ ] Statistiques affichées (ventes, produits, commandes)
- [ ] Graphiques de ventes
- [ ] Dernières commandes
- [ ] Quick actions

#### Gestion Produits (/seller/products)
- [ ] Liste des produits du vendeur
- [ ] Ajouter un nouveau produit
- [ ] Modifier un produit existant
- [ ] Supprimer un produit
- [ ] Upload d'images produit
- [ ] Gestion du stock
- [ ] Produits avec variations (tailles, couleurs)

#### Gestion Commandes (/seller/orders)
- [ ] Liste des commandes reçues
- [ ] Détails d'une commande
- [ ] Changer le statut (traitement, expédié, livré)
- [ ] Notifications de nouvelles commandes
- [ ] Générer étiquette d'expédition (si implémenté)

#### Revenus (/seller/revenue)
- [ ] Total des ventes
- [ ] Commissions (10%)
- [ ] Solde disponible
- [ ] Historique des paiements
- [ ] Demande de paiement

---

### 🔧 Espace Admin

#### Dashboard Admin (/admin)
- [ ] Statistiques globales
- [ ] Quick actions (Users, Products, Orders, etc.)
- [ ] Graphiques de performance

#### Gestion Utilisateurs (/admin/users)
- [ ] Liste de tous les utilisateurs
- [ ] Filtrer par rôle (buyer/seller/admin)
- [ ] Voir détails utilisateur
- [ ] Modifier rôle utilisateur
- [ ] Bloquer/débloquer utilisateur

#### Gestion Produits (/admin/products)
- [ ] Liste de tous les produits
- [ ] Approuver/rejeter produits
- [ ] Modifier produits
- [ ] Supprimer produits
- [ ] Filtres et recherche

#### Gestion Commandes (/admin/orders)
- [ ] Liste de toutes les commandes
- [ ] Filtrer par statut
- [ ] Voir détails complets
- [ ] Modifier statut
- [ ] Annuler commande

#### Gestion Catégories (/admin/categories)
- [ ] Liste des catégories
- [ ] Ajouter nouvelle catégorie
- [ ] Modifier catégorie
- [ ] Supprimer catégorie
- [ ] Upload icône catégorie

#### Gestion Coupons (/admin/coupons)
- [ ] Liste des coupons
- [ ] Créer nouveau coupon
- [ ] Types : pourcentage / montant fixe
- [ ] Date d'expiration
- [ ] Limite d'utilisation
- [ ] Activer/désactiver

#### Support Tickets (/admin/tickets)
- [ ] Liste de tous les tickets
- [ ] Filtrer par statut/catégorie
- [ ] Répondre aux tickets
- [ ] Fermer tickets
- [ ] Assigner tickets

#### Paramètres Livraison (/admin/shipping)
- [ ] Zones de livraison
- [ ] Tarifs par zone
- [ ] Délais de livraison
- [ ] Transporteurs

---

### 🔔 Notifications

#### Système de notifications
- [ ] Icône cloche dans le header
- [ ] Badge avec nombre de notifications non lues
- [ ] Clic ouvre le panneau de notifications
- [ ] Marquer comme lu fonctionne
- [ ] Lien vers la ressource fonctionne
- [ ] Notifications en temps réel (si WebSocket)

#### Types de notifications à tester
- [ ] Nouvelle commande (vendeur)
- [ ] Statut commande changé (acheteur)
- [ ] Nouveau message support
- [ ] Récompense de parrainage
- [ ] Points de fidélité gagnés
- [ ] Produit approuvé (vendeur)

---

### 💬 Messages

#### Système de messagerie (/messages)
- [ ] Liste des conversations
- [ ] Créer nouvelle conversation
- [ ] Envoyer message
- [ ] Recevoir message
- [ ] Upload fichier/image dans message
- [ ] Notifications de nouveaux messages

---

### 🌍 Multilingue

#### Changement de langue
- [ ] Switcher FR/EN/ES visible
- [ ] Changement de langue met à jour tout le site
- [ ] URL contient le code langue (/fr/, /en/, /es/)
- [ ] Langue persiste après rafraîchissement
- [ ] Toutes les traductions affichées correctement

---

### 📱 Responsive Design

#### Mobile (< 768px)
- [ ] Header adapté
- [ ] Menu hamburger fonctionne
- [ ] Navigation mobile
- [ ] Panier accessible
- [ ] Checkout utilisable
- [ ] Formulaires utilisables
- [ ] Images adaptées

#### Tablette (768px - 1024px)
- [ ] Layout adapté
- [ ] Navigation claire
- [ ] Tous les éléments visibles

#### Desktop (> 1024px)
- [ ] Layout complet
- [ ] Sidebar visible si applicable
- [ ] Dropdowns fonctionnent

---

## 🔒 Tests de Sécurité

### Authentification
- [ ] Pages protégées redirigent vers /login
- [ ] Admin ne peut pas accéder sans rôle admin
- [ ] Vendeur ne peut voir que ses produits
- [ ] Tokens JWT valides
- [ ] Session expire correctement

### Validation des données
- [ ] XSS prévenu (pas de script injection)
- [ ] SQL/NoSQL injection prévenu
- [ ] Upload de fichiers sécurisé (types, taille)
- [ ] CSRF protection (si implémenté)

---

## ⚡ Tests de Performance

- [ ] Page d'accueil charge en < 3s
- [ ] Images optimisées/compressées
- [ ] Pas de requêtes inutiles
- [ ] Pagination fonctionne (produits, commandes)
- [ ] Recherche rapide

---

## 🐛 Tests d'Erreurs

- [ ] Page 404 personnalisée pour routes inexistantes
- [ ] Messages d'erreur clairs
- [ ] Formulaires valident avant soumission
- [ ] Erreurs API affichées à l'utilisateur
- [ ] Page d'erreur 500 (si applicable)

---

## 🎨 Tests UI/UX

- [ ] Couleurs cohérentes (vert #16a34a)
- [ ] Typographie lisible
- [ ] Boutons ont hover states
- [ ] Loading states pendant chargement
- [ ] Animations fluides
- [ ] Pas de contenu qui déborde
- [ ] Contrastes suffisants (accessibilité)

---

## 📊 Tests des données

### Seed Data
- [ ] Script seed:products fonctionne
- [ ] Catégories créées
- [ ] Produits créés avec bonnes données
- [ ] Images assignées

### Base de données
- [ ] Connexion MongoDB stable
- [ ] Index créés (si applicable)
- [ ] Relations entre documents correctes
- [ ] Pas de données orphelines

---

## 🔗 Tests d'Intégration

### Flux complet acheteur
1. [ ] S'inscrire avec code parrainage
2. [ ] Parcourir les produits
3. [ ] Ajouter au panier
4. [ ] Appliquer code promo
5. [ ] Passer commande
6. [ ] Recevoir notification
7. [ ] Voir commande dans historique
8. [ ] Gagner des points de fidélité

### Flux complet vendeur
1. [ ] S'inscrire comme vendeur
2. [ ] Ajouter des produits
3. [ ] Recevoir une commande
4. [ ] Traiter la commande
5. [ ] Marquer comme expédiée
6. [ ] Voir les revenus

### Flux complet admin
1. [ ] Se connecter comme admin
2. [ ] Approuver un produit
3. [ ] Créer un coupon
4. [ ] Gérer un ticket support
5. [ ] Voir les statistiques globales

---

## 📝 Checklist Finale avant Production

- [ ] Tous les tests ci-dessus passés ✅
- [ ] Aucune erreur console dans le navigateur
- [ ] Aucune erreur dans les logs serveur
- [ ] Variables d'environnement de production prêtes
- [ ] .env.production créé avec bonnes valeurs
- [ ] MongoDB production configuré
- [ ] Domaine configuré
- [ ] SSL/HTTPS activé
- [ ] Email de contact réel configuré
- [ ] Sauvegardes DB configurées
- [ ] Monitoring configuré (optionnel)
- [ ] Page Coming Soon retirée

---

## 🚀 Commandes de test

```bash
# Lancer le serveur de dev
npm run dev

# Lancer MongoDB (si local)
mongod

# Créer des données de test
npm run seed:products

# Build de production (test)
npm run build

# Lancer en mode production (test local)
npm start
```

---

## 📧 Emails de test

Utilisez ces emails pour tester différents rôles :
- admin@test.com - Admin
- seller@test.com - Vendeur
- buyer@test.com - Acheteur

Mot de passe pour tous : `password123`

---

## 🎯 Priorités de test

### Critique (à tester en priorité) 🔴
1. Authentification (login/register/logout)
2. Ajouter au panier
3. Passer commande
4. Gestion produits vendeur
5. Paiement (quand intégré)

### Important 🟡
1. Profil utilisateur
2. Wishlist
3. Notifications
4. Support tickets
5. Programme de parrainage

### Nice to have 🟢
1. Changement de langue
2. Animations
3. SEO
4. Performance optimale

---

**Date de début des tests :** _________________

**Date de fin des tests :** _________________

**Testeur :** _________________

**Bugs trouvés :** (noter dans un fichier BUGS.md)

Bon courage pour les tests ! 🚀
