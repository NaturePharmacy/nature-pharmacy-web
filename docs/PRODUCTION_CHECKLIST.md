# Liste des Tâches Avant Production

Cette checklist complète détaille toutes les étapes à accomplir avant de lancer Nature Pharmacy en production.

## 📋 Table des Matières

1. [Configuration Essentielle](#configuration-essentielle)
2. [Base de Données](#base-de-données)
3. [Sécurité](#sécurité)
4. [Email & Notifications](#email--notifications)
5. [Paiement](#paiement)
6. [SEO & Référencement](#seo--référencement)
7. [Contenu](#contenu)
8. [Tests](#tests)
9. [Performance](#performance)
10. [Déploiement](#déploiement)
11. [Post-Lancement](#post-lancement)

---

## 🔧 Configuration Essentielle

### Variables d'Environnement

- [ ] **MONGODB_URI**: Configurer MongoDB Atlas pour production
  - Créer un cluster MongoDB Atlas (gratuit disponible)
  - Configurer les IP autorisées (whitelist)
  - Créer un utilisateur avec droits appropriés
  - Copier la chaîne de connexion dans `.env.local`

- [ ] **NEXTAUTH_SECRET**: Générer une clé secrète forte
  ```bash
  openssl rand -base64 32
  ```

- [ ] **NEXTAUTH_URL**: Définir l'URL de production
  ```env
  NEXTAUTH_URL=https://votre-domaine.com
  ```

- [ ] **NEXT_PUBLIC_BASE_URL**: Définir l'URL publique
  ```env
  NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
  ```

- [ ] **BLOB_READ_WRITE_TOKEN**: Configurer Vercel Blob Storage
  - Créer un Blob store dans Vercel
  - Copier le token READ_WRITE

- [ ] **SMTP Configuration**: Configurer les emails
  - SMTP_HOST
  - SMTP_PORT
  - SMTP_USER
  - SMTP_PASS

- [ ] **SEED_ADMIN_KEY**: Générer et sauvegarder en sécurité

---

## 🗄️ Base de Données

### MongoDB Atlas Setup

- [ ] **Créer le cluster de production**
  - Plan M0 (gratuit) ou supérieur selon le besoin
  - Choisir la région la plus proche de vos utilisateurs

- [ ] **Configurer la sécurité**
  - Activer l'authentification
  - Configurer le Network Access (IP whitelist)
  - Créer des utilisateurs avec rôles appropriés

- [ ] **Backup automatique**
  - Activer les backups automatiques
  - Configurer la rétention (7-30 jours minimum)

- [ ] **Monitoring**
  - Activer les alertes MongoDB Atlas
  - Configurer les seuils (CPU, RAM, connexions)

### Données Initiales

- [ ] **Créer le compte administrateur**
  ```bash
  npm run create-admin
  ```

- [ ] **Initialiser les Settings**
  - Vérifier que les paramètres par défaut sont créés
  - Configurer les notifications email
  - Définir la devise par défaut

- [ ] **Créer les catégories principales**
  - Plantes médicinales
  - Huiles essentielles
  - Cosmétiques naturels
  - Tisanes
  - Remèdes traditionnels
  - Suppléments

- [ ] **Ajouter les zones de livraison**
  - Configurer les pays/régions
  - Définir les frais de port
  - Configurer les délais de livraison

---

## 🔒 Sécurité

### Authentification & Autorisation

- [ ] **Tester l'authentification**
  - Inscription utilisateur
  - Connexion/Déconnexion
  - Vérification email
  - Réinitialisation mot de passe

- [ ] **Vérifier les rôles**
  - Admin: accès complet
  - Seller: gestion produits
  - User: compte client

- [ ] **Rate Limiting** (Recommandé)
  - Implémenter rate limiting sur les API
  - Protéger contre brute force login
  - Limiter les requêtes par IP

### Protection des Données

- [ ] **HTTPS obligatoire**
  - Configurer SSL/TLS
  - Rediriger HTTP → HTTPS
  - HSTS headers

- [ ] **Headers de sécurité**
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy

- [ ] **Validation des données**
  - Vérifier toutes les API routes
  - Validation côté serveur
  - Sanitization des inputs

- [ ] **Protection CSRF**
  - NextAuth gère déjà CSRF
  - Vérifier les formulaires

### Mot de Passe Site (Optionnel)

- [ ] **Activer/Désactiver la protection**
  - Définir SITE_PASSWORD si nécessaire
  - Tester l'accès avec/sans mot de passe

---

## 📧 Email & Notifications

### Configuration SMTP

- [ ] **Choisir le fournisseur**
  - Gmail (App Password requis)
  - Outlook/Office 365
  - SendGrid (recommandé pour production)
  - AWS SES
  - Mailgun

- [ ] **Tester tous les emails**
  - [ ] Email de vérification
  - [ ] Email de bienvenue
  - [ ] Confirmation de commande
  - [ ] Commande expédiée
  - [ ] Commande livrée
  - [ ] Commande annulée
  - [ ] Réinitialisation mot de passe

- [ ] **Personnaliser les templates**
  - Ajouter logo dans les emails
  - Vérifier les traductions (fr/en/es)
  - Tester l'affichage sur mobile

- [ ] **Configurer les notifications admin**
  - Dans Admin → Settings → Notifications
  - Activer/désactiver selon les besoins

---

## 💳 Paiement

### Passerelles de Paiement

- [ ] **Choisir les méthodes de paiement**
  - [ ] Stripe
  - [ ] PayPal
  - [ ] Autre (à implémenter)

#### Si Stripe:

- [ ] **Créer compte Stripe**
  - Mode test d'abord
  - Puis activer mode production

- [ ] **Configurer les clés**
  ```env
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
  STRIPE_SECRET_KEY=sk_live_...
  ```

- [ ] **Tester les paiements**
  - Paiement réussi
  - Paiement échoué
  - Remboursement

- [ ] **Configurer les webhooks**
  - URL: https://votre-domaine.com/api/webhooks/stripe
  - Événements à écouter: payment_intent.succeeded, etc.

#### Si PayPal:

- [ ] **Créer compte PayPal Business**
- [ ] **Configurer les clés API**
  ```env
  PAYPAL_CLIENT_ID=...
  PAYPAL_SECRET_KEY=...
  ```
- [ ] **Tester en sandbox puis production**

### Activation dans Admin

- [ ] **Activer les méthodes de paiement**
  - Admin → Settings → Payment Methods
  - Sélectionner et configurer

---

## 🔍 SEO & Référencement

### Google Search Console

- [ ] **Vérifier le site**
  - Ajouter la propriété
  - Méthode: Balise HTML (GOOGLE_SITE_VERIFICATION)
  - Ou fichier HTML
  - Ou DNS

- [ ] **Soumettre le sitemap**
  - URL: https://votre-domaine.com/sitemap.xml
  - Vérifier l'indexation

- [ ] **Vérifier robots.txt**
  - URL: https://votre-domaine.com/robots.txt
  - Tester avec l'outil Google

### Google Analytics

- [ ] **Créer propriété GA4**
  - Obtenir le Measurement ID

- [ ] **Implémenter le tracking** (Optionnel mais recommandé)
  - Ajouter Google Analytics script
  - Tester avec Google Tag Assistant

### Réseaux Sociaux

- [ ] **Créer pages professionnelles**
  - Facebook Business Page
  - Instagram Business
  - Twitter/X (optionnel)

- [ ] **Tester les partages**
  - Open Graph tags
  - Twitter Cards
  - Utiliser: https://cards-dev.twitter.com/validator
  - Utiliser: https://developers.facebook.com/tools/debug/

### Rich Results

- [ ] **Tester le balisage structuré**
  - Outil: https://search.google.com/test/rich-results
  - Vérifier WebSite schema
  - Vérifier Organization schema
  - Vérifier BlogPosting schema (sur articles)

---

## 📝 Contenu

### Pages Statiques

- [ ] **Créer les pages légales**
  - [ ] Mentions légales
  - [ ] Conditions Générales de Vente (CGV)
  - [ ] Politique de confidentialité
  - [ ] Politique de cookies
  - [ ] Conditions d'utilisation

- [ ] **Page À propos**
  - Histoire de l'entreprise
  - Mission et valeurs
  - Équipe (optionnel)

- [ ] **Page Contact**
  - Formulaire de contact
  - Email
  - Téléphone
  - Adresse (si physique)

- [ ] **FAQ**
  - Questions fréquentes
  - Livraison
  - Retours
  - Paiement
  - Produits

### Contenu Produits

- [ ] **Ajouter les produits**
  - Minimum 10-20 produits pour le lancement
  - Photos haute qualité
  - Descriptions complètes (fr/en/es)
  - Prix et stock
  - Catégories assignées

- [ ] **Images produits**
  - Format WebP recommandé
  - Plusieurs angles
  - Optimisées (< 200KB)
  - Alt text pour SEO

### Blog

- [ ] **Créer des articles initiaux**
  - Minimum 5-10 articles pour le lancement
  - Thèmes: santé, plantes, bien-être
  - SEO optimisés
  - Images de qualité

- [ ] **Catégories blog**
  - Santé (health)
  - Nutrition
  - Bien-être (wellness)
  - Plantes médicinales (herbal)
  - Soins de la peau (skincare)
  - Actualités (news)
  - Conseils (tips)

### Traductions

- [ ] **Vérifier toutes les traductions**
  - Français (complet)
  - Anglais (complet)
  - Espagnol (complet)

- [ ] **Vérifier les fichiers i18n**
  - messages/fr.json
  - messages/en.json
  - messages/es.json

---

## 🧪 Tests

### Tests Fonctionnels

- [ ] **Parcours utilisateur complet**
  - [ ] Inscription + vérification email
  - [ ] Connexion
  - [ ] Navigation produits
  - [ ] Filtres et recherche
  - [ ] Ajout au panier
  - [ ] Processus de commande complet
  - [ ] Paiement
  - [ ] Confirmation commande
  - [ ] Réception email

- [ ] **Espace vendeur** (si activé)
  - [ ] Inscription vendeur
  - [ ] Ajout de produits
  - [ ] Gestion des commandes
  - [ ] Messagerie

- [ ] **Admin Dashboard**
  - [ ] Toutes les sections accessibles
  - [ ] CRUD sur toutes les entités
  - [ ] Settings fonctionnels
  - [ ] Analytics affichés

### Tests Navigateurs

- [ ] **Tester sur différents navigateurs**
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari
  - [ ] Mobile browsers

### Tests Devices

- [ ] **Responsive Design**
  - [ ] Mobile (320px+)
  - [ ] Tablet (768px+)
  - [ ] Desktop (1024px+)
  - [ ] Large screens (1440px+)

### Tests Sécurité

- [ ] **Tester les permissions**
  - Utilisateur non connecté
  - Utilisateur connecté (role: user)
  - Vendeur (role: seller)
  - Admin (role: admin)

- [ ] **Tester les validations**
  - Formulaires avec données invalides
  - Tentative d'accès non autorisé
  - Upload fichiers malveillants

---

## ⚡ Performance

### Optimisation Images

- [ ] **Optimiser toutes les images**
  - Utiliser format WebP
  - Compression (80-85% qualité)
  - Lazy loading (Next.js le fait)
  - Dimensions appropriées

### Lighthouse Score

- [ ] **Tester avec Lighthouse**
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 90

- [ ] **Core Web Vitals**
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Caching

- [ ] **Configurer le cache**
  - Images: long cache
  - Static assets: long cache
  - API: cache approprié

- [ ] **CDN** (Si nécessaire)
  - Vercel le gère automatiquement
  - Ou CloudFlare

---

## 🚀 Déploiement

### Choix de la Plateforme

**Option 1: Vercel (Recommandé)**

- [ ] **Créer compte Vercel**
- [ ] **Connecter le repository Git**
- [ ] **Configurer les variables d'environnement**
  - Copier toutes les vars de .env.local
  - Dans Settings → Environment Variables

- [ ] **Configurer le domaine**
  - Ajouter domaine personnalisé
  - Configurer DNS (A ou CNAME records)
  - Activer HTTPS automatique

- [ ] **Build settings**
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`

**Option 2: Autres (AWS, DigitalOcean, etc.)**

- [ ] **Configurer le serveur**
- [ ] **Installer Node.js 18+**
- [ ] **Configurer Nginx/Apache**
- [ ] **Configurer PM2 ou équivalent**
- [ ] **SSL/TLS certificate (Let's Encrypt)**

### Pre-Deployment

- [ ] **Build local réussi**
  ```bash
  npm run build
  npm run start
  ```

- [ ] **Corriger tous les warnings/errors**

- [ ] **Vérifier .gitignore**
  - .env.local ignoré
  - node_modules ignoré
  - .next ignoré

### Deployment

- [ ] **Premier déploiement**
  - Push sur Git
  - Vercel déploie automatiquement

- [ ] **Vérifier le build**
  - Logs de build sans erreur
  - Temps de build acceptable

- [ ] **Tester le site en production**
  - Toutes les pages accessibles
  - Fonctionnalités opérationnelles

### DNS & Domaine

- [ ] **Acheter le domaine** (si pas déjà fait)
  - Namecheap, GoDaddy, etc.

- [ ] **Configurer DNS**
  - A record: @ → IP serveur (si VPS)
  - CNAME: www → votre-app.vercel.app (si Vercel)
  - Attendre propagation (24-48h max)

- [ ] **Configurer SSL**
  - Vercel: automatique
  - Let's Encrypt: si VPS

---

## 📊 Post-Lancement

### Monitoring

- [ ] **Configurer monitoring**
  - Vercel Analytics (inclus)
  - Sentry pour error tracking (optionnel)
  - Uptime monitoring (UptimeRobot, etc.)

- [ ] **Configurer les alertes**
  - Downtime alerts
  - Error rate alerts
  - Performance degradation

### Analytics

- [ ] **Google Analytics**
  - Vérifier que les événements sont tracés
  - Configurer objectifs (conversions)

- [ ] **Search Console**
  - Surveiller l'indexation
  - Vérifier les erreurs crawl
  - Suivre les performances de recherche

### Backup

- [ ] **Backup automatique BD**
  - MongoDB Atlas le fait automatiquement
  - Vérifier la configuration

- [ ] **Backup code**
  - Repository Git (GitHub/GitLab)
  - Branches protégées

### Communication

- [ ] **Annoncer le lancement**
  - Email aux early adopters
  - Réseaux sociaux
  - Blog post de lancement

- [ ] **Créer support client**
  - Email support
  - Chat en direct (optionnel)
  - FAQ mise à jour

### Maintenance

- [ ] **Plan de maintenance**
  - Mises à jour régulières
  - Monitoring quotidien
  - Backup vérifications hebdomadaires

---

## ✅ Checklist Finale

**Avant de mettre en ligne:**

- [ ] Tous les tests passent
- [ ] Performance Lighthouse > 90
- [ ] Toutes les vars d'environnement configurées
- [ ] Compte admin créé
- [ ] Au moins 10 produits ajoutés
- [ ] Pages légales créées
- [ ] Emails testés et fonctionnels
- [ ] Paiement testé (mode test)
- [ ] SEO configuré (sitemap, robots.txt)
- [ ] Google Search Console vérifié
- [ ] SSL/HTTPS activé
- [ ] Domaine configuré
- [ ] Backup automatique activé
- [ ] Monitoring en place

**Premier jour de production:**

- [ ] Vérifier que le site est accessible
- [ ] Tester une commande complète
- [ ] Vérifier les emails
- [ ] Surveiller les logs
- [ ] Vérifier Analytics

**Première semaine:**

- [ ] Surveiller les erreurs quotidiennement
- [ ] Vérifier les performances
- [ ] Répondre aux premiers utilisateurs
- [ ] Ajuster selon feedback
- [ ] Vérifier l'indexation Google

---

## 📚 Ressources Utiles

### Documentation

- [Nature Pharmacy - Email Setup](./EMAIL_SETUP.md)
- [Nature Pharmacy - Admin Setup](./ADMIN_SETUP.md)
- [Nature Pharmacy - SEO Guide](./SEO_GUIDE.md)
- [Nature Pharmacy - Blog JSON Upload](./BLOG_JSON_UPLOAD.md)

### Outils Externes

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics](https://analytics.google.com)
- [Lighthouse](https://pagespeed.web.dev)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [GTmetrix](https://gtmetrix.com)

### Support

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)

---

## 🎯 Priorisation

### Critique (Bloquer)
- Configuration base de données
- Variables d'environnement
- Compte admin
- HTTPS/SSL
- Pages légales

### Important (Lancement)
- Email fonctionnel
- Au moins 10 produits
- Paiement configuré
- SEO de base
- Tests complets

### Souhaitable (Post-lancement)
- Google Analytics
- Blog rempli
- Optimisation images
- Monitoring avancé
- Support client

---

**Bonne chance pour le lancement ! 🚀**
