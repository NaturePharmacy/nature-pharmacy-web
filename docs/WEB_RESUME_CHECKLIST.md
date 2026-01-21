# ✅ Checklist de Reprise - Plateforme Web

Document de référence pour reprendre le développement de la plateforme web Nature Pharmacy et la mettre en production.

---

## 🎯 État Actuel

**Statut**: 🟢 85% Complété - Code Production-Ready

**Ce qui est fait**:
- ✅ Backend complet (API, Models, Auth)
- ✅ Frontend complet (Pages, Components, UI)
- ✅ Stripe Connect (paiements vendeurs)
- ✅ Webhooks (Stripe + PayPal)
- ✅ Rate Limiting & Sécurité
- ✅ Error Monitoring
- ✅ Cookie Consent RGPD
- ✅ Pages légales (CGV, Privacy, etc.)
- ✅ i18n (FR/EN/ES)

**Ce qui reste**: Configuration production + Contenu

---

## 📋 CHECKLIST PRIORITAIRE

### 🔴 CRITIQUE (Bloquant Production) - 2-3 jours

#### 1. Configuration Email SMTP ⚠️ URGENT

**Pourquoi**: Sans emails, pas de vérification compte, confirmation commande, notifications.

**Action**:
```bash
# Option 1: SendGrid (Recommandé - Gratuit 100/jour)
1. Créer compte sur https://sendgrid.com/
2. Verify Sender Identity (votre email)
3. Créer API Key
4. Ajouter à .env.local:

SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.votre_api_key_ici
SMTP_FROM=noreply@votre-domaine.com
```

**Tester**:
```bash
npm run dev
# Créer un compte test → Vérifier réception email
```

**Alternative Gmail** (Développement seulement):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre.email@gmail.com
SMTP_PASS=votre_app_password
```
⚠️ Nécessite activer "App Password" dans Gmail

**Fichiers concernés**:
- `lib/email.ts` (déjà prêt, juste configurer env)
- `.env.local`

**Durée**: 30 minutes

---

#### 2. MongoDB Atlas Production ⚠️

**Action**:
```bash
# 1. Créer cluster MongoDB Atlas
Aller sur: https://www.mongodb.com/cloud/atlas/register

# 2. Créer cluster
- Choisir Provider: AWS / Google Cloud / Azure
- Région: Europe (plus proche utilisateurs)
- Tier: M0 (gratuit) ou M10 (9$/mois recommandé)
- Nom: nature-pharmacy-prod

# 3. Créer utilisateur database
- Username: admin_np
- Password: [générer fort]
- Privileges: Read and write to any database

# 4. Configurer Network Access
- Add IP Address
- Allow Access from Anywhere: 0.0.0.0/0
  (ou restreindre à IP Vercel)

# 5. Obtenir connection string
- Connect → Drivers → Node.js
- Copier: mongodb+srv://admin_np:<password>@cluster.mongodb.net/

# 6. Ajouter à .env.local
MONGODB_URI=mongodb+srv://admin_np:VOTRE_PASSWORD@cluster.mongodb.net/nature-pharmacy?retryWrites=true&w=majority
```

**Tester**:
```bash
npm run dev
# Vérifier connexion dans terminal: "✅ MongoDB connected"
```

**Backup**:
```bash
# Activer backup automatique dans Atlas
# Settings → Backup → Enable
# Retention: 7 jours minimum
```

**Durée**: 1 heure

---

#### 3. Variables d'Environnement Production

**Créer/Mettre à jour** `.env.local`:

```env
# ========================================
# DATABASE
# ========================================
MONGODB_URI=mongodb+srv://admin_np:PASSWORD@cluster.mongodb.net/nature-pharmacy

# ========================================
# NEXTAUTH
# ========================================
NEXTAUTH_URL=https://votre-domaine.com
NEXTAUTH_SECRET=GENERER_NOUVELLE_CLE_32_CHARS

# ========================================
# EMAIL (SendGrid)
# ========================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.VOTRE_API_KEY
SMTP_FROM=noreply@votre-domaine.com

# ========================================
# STRIPE (LIVE KEYS)
# ========================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE
STRIPE_SECRET_KEY=sk_live_VOTRE_CLE
STRIPE_WEBHOOK_SECRET=whsec_LIVE_SECRET
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_LIVE_CONNECT_SECRET

# ========================================
# PAYPAL (LIVE)
# ========================================
PAYPAL_CLIENT_ID=LIVE_CLIENT_ID
PAYPAL_SECRET_KEY=LIVE_SECRET
PAYPAL_WEBHOOK_ID=LIVE_WEBHOOK_ID
PAYPAL_MODE=live

# ========================================
# VERCEL BLOB STORAGE
# ========================================
BLOB_READ_WRITE_TOKEN=VOTRE_TOKEN

# ========================================
# APP SETTINGS
# ========================================
NEXT_PUBLIC_BASE_URL=https://votre-domaine.com
NEXT_PUBLIC_APP_NAME=Nature Pharmacy

# ========================================
# ADMIN
# ========================================
SEED_ADMIN_KEY=GENERER_CLE_FORTE
ADMIN_API_TOKEN=GENERER_TOKEN_ADMIN

# ========================================
# SECURITY (Optionnel)
# ========================================
NEXT_PUBLIC_SENTRY_DSN=https://votre-sentry-dsn
GOOGLE_SITE_VERIFICATION=votre-code-verification
```

**Générer clés secrètes**:
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# SEED_ADMIN_KEY
openssl rand -base64 32

# ADMIN_API_TOKEN
openssl rand -hex 32
```

**Durée**: 30 minutes

---

#### 4. Créer Compte Admin Initial

**Action**:
```bash
# Méthode 1: Script CLI (Recommandé)
npm run create-admin

# Suivre les prompts:
# - Nom: Admin
# - Email: admin@votre-domaine.com
# - Password: [choisir fort]

# Méthode 2: API (si script pas dispo)
# POST http://localhost:3000/api/admin/seed
# Headers: x-seed-key: VOTRE_SEED_KEY
# Body: {
#   "name": "Admin",
#   "email": "admin@example.com",
#   "password": "Admin@123456"
# }
```

**Vérifier**:
```bash
# Se connecter sur /admin/login
# Email: admin@votre-domaine.com
# Password: celui créé
```

**Durée**: 10 minutes

---

#### 5. Passer Stripe/PayPal en Mode Live

**Stripe**:
```bash
# 1. Activer compte Stripe en mode live
# https://dashboard.stripe.com/

# 2. Obtenir clés live
# Developers → API keys
# - Publishable key: pk_live_...
# - Secret key: sk_live_...

# 3. Créer webhooks LIVE
# Developers → Webhooks → Add endpoint

# Webhook 1: Paiements
URL: https://votre-domaine.com/api/webhooks/stripe
Events:
  - payment_intent.succeeded
  - payment_intent.payment_failed
  - payment_intent.canceled
  - charge.refunded
  - checkout.session.completed

# Webhook 2: Stripe Connect
URL: https://votre-domaine.com/api/webhooks/stripe-connect
Events:
  - account.updated
  - account.application.authorized
  - account.application.deauthorized
  - capability.updated
  - payout.paid
  - payout.failed

# 4. Copier signing secrets
# Ajouter à .env.local:
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...
```

**PayPal**:
```bash
# 1. Passer en mode LIVE
# https://developer.paypal.com/

# 2. Obtenir credentials LIVE
# My Apps & Credentials → Live

# 3. Créer webhook LIVE
URL: https://votre-domaine.com/api/webhooks/paypal
Events:
  - PAYMENT.CAPTURE.COMPLETED
  - PAYMENT.CAPTURE.DENIED
  - PAYMENT.CAPTURE.PENDING
  - CHECKOUT.ORDER.APPROVED
  - PAYMENT.CAPTURE.REFUNDED

# 4. Ajouter à .env.local:
PAYPAL_MODE=live
```

**Durée**: 1 heure

---

### 🟠 IMPORTANT (Lancement) - 3-4 jours

#### 6. Ajouter Produits (Minimum 15-20) ⚠️

**Action**:
```bash
# 1. Se connecter en admin
# /admin/login

# 2. Aller dans Products → Add New

# 3. Pour CHAQUE produit:
- Nom (FR/EN/ES)
- Description complète (FR/EN/ES)
- Prix
- Stock initial
- Catégorie
- Images (3-5 par produit)
- Spécifications
- Bénéfices
- Ingrédients
- Mode d'emploi
- Tags (bio, naturel, etc.)

# 4. Marquer quelques produits en "Featured"
```

**Template Excel pour préparer** (optionnel):
```
Nom | Description | Prix | Stock | Catégorie | Images
----|-------------|------|-------|-----------|-------
Huile Argan Bio | Description... | 29.99 | 50 | essential-oils | argan1.jpg, argan2.jpg
...
```

**Conseil**: Commencer par 5 produits par catégorie (6 catégories = 30 produits)

**Durée**: 2-3 jours (selon qualité descriptions)

---

#### 7. Créer Catégories

**Action**:
```bash
# Admin → Categories → Add New

Catégories principales:
1. Plantes Médicinales (medicinal-plants)
2. Huiles Essentielles (essential-oils)
3. Remèdes Traditionnels (traditional-remedies)
4. Tisanes Thérapeutiques (herbal-teas)
5. Compléments Naturels (supplements)
6. Cosmétiques Naturels (natural-cosmetics)

Pour chaque catégorie:
- Nom (FR/EN/ES)
- Description
- Image bannière
- Icône/Emoji
```

**Durée**: 1 heure

---

#### 8. Optimiser Images

**Action**:
```bash
# 1. Redimensionner images produits
# Taille recommandée: 800x800px

# 2. Compresser images
# Outil: https://tinypng.com/
# Ou: https://squoosh.app/

# 3. Convertir en WebP (optionnel)
# Next.js le fait automatiquement via Image component

# 4. Nommer fichiers correctement
# Bon: huile-argan-bio-100ml.jpg
# Mauvais: IMG_20240101.jpg
```

**Durée**: 1 jour (si beaucoup d'images)

---

#### 9. Tests Complets

**Parcours utilisateur**:
```bash
# Test 1: Inscription + Vérification Email
1. S'inscrire avec email test
2. Vérifier réception email
3. Cliquer lien vérification
4. Vérifier compte activé

# Test 2: Achat Complet (MODE TEST)
1. Parcourir produits
2. Ajouter au panier
3. Checkout
4. Payer avec carte test: 4242 4242 4242 4242
5. Vérifier email confirmation
6. Vérifier commande dans profil

# Test 3: Vendeur
1. Créer compte vendeur
2. Ajouter produit
3. Onboarding Stripe Connect
4. Vérifier dashboard

# Test 4: Admin
1. Se connecter en admin
2. Vérifier analytics
3. Gérer une commande
4. Modifier un produit
```

**Tester sur**:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari (si macOS)
- ✅ Mobile (responsive)

**Durée**: 1 jour

---

#### 10. Déploiement Vercel

**Action**:
```bash
# 1. Créer compte Vercel (si pas fait)
# https://vercel.com/signup

# 2. Connecter GitHub repo
# New Project → Import Git Repository

# 3. Configurer Build Settings
# Framework Preset: Next.js
# Root Directory: nature-pharmacy
# Build Command: npm run build
# Output Directory: .next

# 4. Ajouter toutes les variables d'environnement
# Settings → Environment Variables
# Copier TOUTES les vars de .env.local

# 5. Déployer
# Deploy
```

**Vérifier après déploiement**:
- ✅ Site accessible
- ✅ Pages chargent
- ✅ Images affichent
- ✅ API fonctionne
- ✅ Auth fonctionne

**Durée**: 2 heures

---

### 🟡 SOUHAITABLE (Post-lancement) - 2-3 jours

#### 11. Créer Articles Blog (5-10)

**Suggestions d'articles**:
1. "Les bienfaits de l'huile d'argan pour la peau"
2. "Comment choisir ses huiles essentielles"
3. "5 plantes médicinales à avoir chez soi"
4. "Guide complet des tisanes thérapeutiques"
5. "Remèdes naturels contre le stress"

**Pour chaque article**:
- Titre accrocheur
- Image featured
- Contenu 500-1000 mots
- SEO optimisé (mots-clés)
- Traductions FR/EN/ES

**Durée**: 2-3 jours

---

#### 12. Configuration SEO

**Google Search Console**:
```bash
# 1. Aller sur https://search.google.com/search-console

# 2. Ajouter propriété
# URL: https://votre-domaine.com

# 3. Vérifier propriété
# Méthode recommandée: Balise HTML
# Copier le code de vérification
# Ajouter à .env.local:
GOOGLE_SITE_VERIFICATION=votre_code

# 4. Soumettre sitemap
# URL: https://votre-domaine.com/sitemap.xml

# 5. Demander indexation
# URL Inspection → Request Indexing
```

**Google Analytics** (optionnel):
```bash
# 1. Créer propriété GA4
# https://analytics.google.com/

# 2. Obtenir Measurement ID
# Format: G-XXXXXXXXXX

# 3. Ajouter Google Tag dans layout.tsx
# Ou utiliser: npm install @next/third-parties
```

**Durée**: 2 heures

---

#### 13. Configuration DNS & Domaine

**Acheter domaine** (si pas fait):
- Namecheap, GoDaddy, OVH, etc.
- Recommandé: .com ou ccTLD local

**Configurer DNS pour Vercel**:
```bash
# Dans votre registrar de domaine:

# Option 1: CNAME (recommandé)
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21

# Option 2: DNS Nameservers (plus simple)
Nameservers Vercel:
- ns1.vercel-dns.com
- ns2.vercel-dns.com

# Attendre propagation: 24-48h max
```

**Configurer dans Vercel**:
```bash
# Settings → Domains
# Add Domain → votre-domaine.com
# Suivre instructions
```

**Durée**: 1 heure + attente propagation

---

#### 14. Activer HTTPS/SSL

**Vercel** (automatique):
- SSL certificate généré automatiquement
- Rien à faire !

**Vérifier**:
```bash
# Tester sur: https://www.ssllabs.com/ssltest/
# Score attendu: A ou A+
```

**Durée**: Automatique

---

#### 15. Backup & Monitoring

**MongoDB Atlas Backups**:
```bash
# 1. Atlas Dashboard → Backup
# 2. Enable Cloud Backup
# 3. Snapshot Schedule: Daily
# 4. Retention: 7 jours minimum
```

**Monitoring**:
```bash
# Vercel Analytics (inclus)
# - Automatiquement actif

# Uptime Robot (gratuit)
# 1. https://uptimerobot.com/
# 2. Add New Monitor
# 3. Type: HTTPS
# 4. URL: votre-domaine.com
# 5. Interval: 5 minutes
# 6. Alert: Email when down
```

**Durée**: 1 heure

---

## 📅 PLANNING RECOMMANDÉ

### Jour 1 : Configuration Critique
- ☐ Configurer SMTP (SendGrid)
- ☐ Configurer MongoDB Atlas
- ☐ Variables d'environnement
- ☐ Créer admin
- ☐ Tester emails

### Jour 2 : Paiements
- ☐ Passer Stripe en live
- ☐ Créer webhooks Stripe
- ☐ Passer PayPal en live
- ☐ Créer webhook PayPal
- ☐ Tester paiement test

### Jour 3-4 : Contenu
- ☐ Créer catégories
- ☐ Ajouter 20 produits
- ☐ Optimiser images
- ☐ Créer 2-3 articles blog

### Jour 5 : Tests
- ☐ Tests parcours complet
- ☐ Tests navigateurs
- ☐ Tests mobile
- ☐ Corrections bugs

### Jour 6 : Déploiement
- ☐ Déployer sur Vercel
- ☐ Configurer domaine
- ☐ Vérifier production
- ☐ Tests finaux

### Jour 7+ : SEO & Monitoring
- ☐ Google Search Console
- ☐ Soumettre sitemap
- ☐ Google Analytics
- ☐ Uptime monitoring
- ☐ Backups configurés

---

## 🎯 CHECKLIST FINALE AVANT LANCEMENT

### Infrastructure ✓
- [ ] MongoDB Atlas production configuré
- [ ] SMTP configuré et testé
- [ ] Toutes variables env configurées
- [ ] Compte admin créé
- [ ] Stripe en mode live
- [ ] PayPal en mode live
- [ ] Webhooks configurés

### Contenu ✓
- [ ] Minimum 15 produits ajoutés
- [ ] Images optimisées
- [ ] Catégories créées
- [ ] 3-5 articles blog (minimum)
- [ ] Pages légales vérifiées

### Tests ✓
- [ ] Inscription + email fonctionne
- [ ] Achat complet testé (mode test)
- [ ] Vendeur peut ajouter produit
- [ ] Admin dashboard accessible
- [ ] Tests sur 3+ navigateurs
- [ ] Tests mobile responsive

### Production ✓
- [ ] Déployé sur Vercel
- [ ] Domaine configuré
- [ ] HTTPS actif (SSL)
- [ ] Google Search Console vérifié
- [ ] Sitemap soumis
- [ ] Monitoring actif
- [ ] Backups configurés

### Premier Jour Production ✓
- [ ] Site accessible publiquement
- [ ] Créer vraie commande test (petite somme)
- [ ] Vérifier email confirmation
- [ ] Surveiller logs erreurs
- [ ] Vérifier analytics

---

## 📞 SUPPORT & RESSOURCES

### Documentation Projet
- `docs/PRODUCTION_CHECKLIST.md` - Checklist détaillée
- `docs/EMAIL_SETUP.md` - Configuration emails
- `docs/STRIPE_CONNECT.md` - Stripe Connect setup
- `docs/WEBHOOKS_SETUP.md` - Configuration webhooks
- `docs/SECURITY.md` - Guide sécurité
- `docs/SEO_GUIDE.md` - Optimisation SEO

### Liens Utiles
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [SendGrid](https://sendgrid.com/)
- [Google Search Console](https://search.google.com/search-console)

### En Cas de Problème

**Erreur de connexion MongoDB**:
```bash
# Vérifier IP whitelist dans Atlas
# Vérifier format connection string
# Vérifier user/password
```

**Emails ne s'envoient pas**:
```bash
# Vérifier SMTP credentials
# Vérifier SendGrid sender verification
# Vérifier logs: npm run dev
```

**Webhook non reçu**:
```bash
# Vérifier URL webhook sur Stripe/PayPal
# Vérifier signature secret
# Vérifier logs dans dashboard Stripe
```

---

## 🎉 APRÈS LE LANCEMENT

### Semaine 1
- Surveiller erreurs quotidiennement
- Vérifier toutes les commandes
- Répondre aux premiers utilisateurs
- Corriger bugs urgents

### Mois 1
- Analyser métriques (ventes, trafic)
- Ajouter plus de produits
- Créer plus d'articles blog
- Optimiser SEO
- Réseaux sociaux

### Mois 2-3
- Marketing (email, social media)
- Améliorer UX selon feedback
- Nouvelles fonctionnalités
- Programme d'affiliation
- Partenariats vendeurs

---

**Date de création**: Janvier 2026
**À utiliser**: Quand on reprend le développement web

**Durée totale estimée**: 1-2 semaines pour production complète

🚀 **Prêt pour le lancement !**
