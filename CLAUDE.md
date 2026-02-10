# CLAUDE.md - Nature Pharmacy Project Context

> **INSTRUCTION OBLIGATOIRE** : Ce fichier doit etre mis a jour regulierement par Claude a chaque session significative.
> Ajouter les nouvelles decisions, bugs resolus, et changements architecturaux importants.
> **Le site est EN PRODUCTION** sur https://naturepharmacy.com — toute correction doit etre la moins invasive possible.
> Eviter les refactors massifs, privilegier les fixes chirurgicaux.

---

## Projet

- **Nom** : Nature Pharmacy
- **URL Production** : https://naturepharmacy.com
- **Repo GitHub** : https://github.com/NaturePharmacy/nature-pharmacy-web.git
- **Branche principale** : `master`
- **Deploiement** : Vercel (auto-deploy sur push master)
- **Chemin local** : `c:\Users\pc\Nature Pharmacy\nature-pharmacy`

---

## Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router) | 15.1.6 |
| React | React | 19.2.0 |
| TypeScript | TypeScript | 5.x |
| CSS | Tailwind CSS | 4.x |
| Base de donnees | MongoDB (Mongoose) | 8.20.1 |
| Auth | NextAuth.js (JWT, credentials) | 4.24.13 |
| i18n | next-intl | 4.5.3 |
| Paiement | Stripe + PayPal | - |
| Email | Nodemailer | 7.0.10 |
| Stockage fichiers | Vercel Blob | 2.0.0 |
| Traitement images | Sharp | 0.34.5 |
| Validation | Zod | 4.1.12 |

---

## Git & Comptes GitHub

### Compte Nature Pharmacy
- **Repo** : `NaturePharmacy/nature-pharmacy-web`
- **Remote** : `https://github.com/NaturePharmacy/nature-pharmacy-web.git`

### Probleme multi-workspace
Le PC utilise un autre compte GitHub globalement (`Magnetiksn2025` / `jokergamersn@outlook.com`).
Pour Nature Pharmacy, le repo a sa propre config locale.

**Config actuelle** : Le remote utilise un PAT (Personal Access Token) dans l'URL.
Le git local est configure avec `user.name=NaturePharmacy` et `user.email=contact@naturepharmacy.com`.
Aucun conflit avec le compte global (`Magnetiksn2025`).

**Si le token expire ou est revoque** :
1. Aller sur https://github.com/settings/tokens (compte NaturePharmacy)
2. Generer un nouveau token (classic) avec scope `repo`
3. Mettre a jour le remote :
```bash
cd "c:\Users\pc\Nature Pharmacy\nature-pharmacy"
git remote set-url origin https://<NOUVEAU_TOKEN>@github.com/NaturePharmacy/nature-pharmacy-web.git
```

---

## Variables d'Environnement (noms uniquement)

### Base de donnees
- `MONGODB_URI`

### Authentication
- `NEXTAUTH_URL` (= https://naturepharmacy.com en prod)
- `NEXTAUTH_SECRET`

### SMTP (Email)
- `SMTP_HOST` (= mail.naturepharmacy.com)
- `SMTP_PORT` (= 465, SSL)
- `SMTP_USER` (= contact@naturepharmacy.com)
- `SMTP_PASS`

> **ATTENTION** : Lors de l'ajout d'env vars sur Vercel, utiliser `printf` et non `echo` pour eviter les `\n` en fin de valeur. Probleme deja rencontre avec SMTP_HOST.

### Stockage Fichiers
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob Store : `nature-pharmacy-images`)

> **IMPORTANT** : Le token doit etre passe explicitement dans les appels `put()` et `del()` de `@vercel/blob`. Voir `lib/vercel-blob-upload.ts`.

### Paiement
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_CONNECT_WEBHOOK_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_SECRET_KEY`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_MODE` (sandbox / production)

### Application
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_APP_NAME`
- `GOOGLE_SITE_VERIFICATION`
- `SITE_PASSWORD` (optionnel - protection par mot de passe)
- `SEED_ADMIN_KEY`

---

## Architecture des Dossiers

```
nature-pharmacy/
├── app/
│   ├── api/                    # ~65 routes API
│   │   ├── auth/               # register, login, forgot-password, verify-email
│   │   ├── admin/              # CRUD admin (users, products, orders, settings...)
│   │   ├── seller/             # stats, products, orders, analytics vendeur
│   │   ├── products/           # CRUD produits publics
│   │   ├── orders/             # commandes
│   │   ├── shipping/           # zones, calcul frais
│   │   ├── stripe-connect/     # onboard, status, balance, dashboard vendeurs
│   │   ├── webhooks/           # paypal
│   │   ├── upload/             # upload images via Vercel Blob
│   │   ├── geo/                # detection pays via headers Vercel
│   │   ├── contact/            # formulaire contact
│   │   └── ...
│   └── [locale]/               # Pages avec prefixe locale (fr/en/es)
│       ├── page.tsx            # Homepage
│       ├── products/           # Listing + detail produits
│       ├── seller/             # Dashboard vendeur
│       ├── admin/              # Dashboard admin
│       ├── account/            # Profil utilisateur
│       ├── checkout/           # Tunnel d'achat
│       └── ...
├── components/                 # Composants React par feature
│   ├── admin/, cart/, product/, seller/, upload/, ...
├── contexts/                   # CartContext, CurrencyContext
├── hooks/                      # useCurrency, useIsSeller, useUserCountry
├── lib/                        # Utilitaires core
│   ├── auth.ts                 # Config NextAuth
│   ├── mongodb.ts              # Connexion MongoDB
│   ├── email.ts                # Envoi emails (lazy transporter)
│   ├── currency.ts             # Source unique devises & taux
│   ├── vercel-blob-upload.ts   # Upload/delete Vercel Blob
│   └── ...
├── models/                     # 16 modeles Mongoose
├── messages/                   # Traductions (fr.json, en.json, es.json)
├── i18n/                       # Config next-intl
├── public/                     # Assets statiques (logos, images)
├── scripts/                    # Seeds (admin, products, shipping, users)
└── types/                      # Types TypeScript
```

---

## Modeles de Donnees (MongoDB)

16 modeles : **User**, **Product**, **Order**, **Category**, **Review**, **Coupon**, **ShippingZone**, **LoyaltyPoints**, **Blog**, **Referral**, **Ticket**, **Conversation**, **Notification**, **Wishlist**, **Brand**, **Settings**

### Roles Utilisateur
- `buyer` (defaut) - Client
- `seller` - Vendeur (avec Stripe Connect)
- `admin` - Administrateur complet

### Prix dans la BD
**Tous les prix sont stockes en USD.** La conversion se fait a l'affichage via `lib/currency.ts`.

---

## Systeme de Devises

**Source unique** : `lib/currency.ts` (importe par `contexts/CurrencyContext.tsx`)

| Devise | Symbole | Taux (1 USD =) | Decimales |
|--------|---------|----------------|-----------|
| USD | $ | 1 | 2 |
| XOF | FCFA | 615 | 0 |
| EUR | € | 0.92 | 2 |
| GBP | £ | 0.79 | 2 |
| MAD | DH | 10.0 | 2 |
| CAD | CA$ | 1.36 | 2 |

**Detection automatique** : `/api/geo` lit `x-vercel-ip-country` → `hooks/useUserCountry.ts` → `CurrencyContext`

---

## Internationalisation

- **Locales** : `fr` (defaut), `en`, `es`
- **Traductions** : `messages/fr.json`, `messages/en.json`, `messages/es.json`
- **Produits** : Champs multilingues `{ fr, en, es }` dans MongoDB
- **Saisie vendeur** : Le vendeur entre dans sa langue, copie dans toutes les langues. Champ `originalLocale` pour futur systeme de traduction automatique.

---

## Email (SMTP)

- **Serveur** : `mail.naturepharmacy.com:465` (SSL/TLS)
- **From** : `contact@naturepharmacy.com`
- **Lib** : `lib/email.ts` avec lazy transporter (initialise a la premiere utilisation)
- **Templates** : Verification email, reset password, welcome, confirmation commande, expedition, livraison, annulation
- **TLS** : `rejectUnauthorized: false`, `minVersion: 'TLSv1.2'`

---

## Stockage Images

- **Service** : Vercel Blob Storage
- **Blob Store** : `nature-pharmacy-images`
- **API** : `POST /api/upload` → Sharp (resize 1200x1200, webp 85%) → Vercel Blob
- **Suppression** : `DELETE /api/upload?publicId=<url>`
- **Token** : `BLOB_READ_WRITE_TOKEN` passe explicitement dans `put()` et `del()`

---

## Paiements

- **Stripe** : Checkout direct + Stripe Connect pour vendeurs (onboard, payouts)
- **PayPal** : Mode sandbox/production, webhook `/api/webhooks/paypal`
- **Cash on Delivery** : Optionnel
- **Commission** : Geree par le modele Settings, appliquee par produit

---

## Bugs Resolus (Historique)

| Date | Bug | Fix | Fichier(s) |
|------|-----|-----|------------|
| 2026-02 | Devises incoherentes (double source) | Unifie sur `lib/currency.ts`, CurrencyContext importe depuis | `lib/currency.ts`, `contexts/CurrencyContext.tsx` |
| 2026-02 | Forgot-password 500 | Ajout check user exists → 404 avec message explicite | `app/api/auth/forgot-password/route.ts` |
| 2026-02 | Contact form 500 | Utilisation de `sendEmail` de `lib/email.ts` au lieu de transporter duplique | `app/api/contact/route.ts` |
| 2026-02 | SMTP DNS failure (`\n` dans env var) | `printf` au lieu de `echo` pour les env vars Vercel | Vercel Dashboard |
| 2026-02 | Prix en $ dans dashboard vendeur | Remplacement `$price.toFixed(2)` par `formatPrice()` | `seller/products/page.tsx`, `seller/orders/page.tsx`, `seller/analytics/page.tsx` |
| 2026-02 | Blob token not found | Token passe explicitement dans `put()` et `del()` | `lib/vercel-blob-upload.ts` |
| 2026-02 | Favicon Vercel par defaut | Logo Nature Pharmacy dans metadata `icons` | `app/[locale]/layout.tsx` |

---

## Regles de Developpement

1. **Production first** : Le site est en prod. Chaque changement doit etre minimal et chirurgical.
2. **Pas de refactor massif** : Corriger uniquement ce qui est demande.
3. **Tester avant push** : Verifier que le build passe (`next build`).
4. **Prix en USD** : Toujours stocker en USD, convertir a l'affichage.
5. **Devise utilisateur** : Toujours utiliser `useCurrency()` / `formatPrice()` du contexte, jamais de `$` en dur.
6. **Emails** : Utiliser `sendEmail()` de `lib/email.ts`, jamais creer un transporter directement.
7. **Upload** : Passer le token explicitement a `@vercel/blob`.
8. **Env vars Vercel** : Utiliser `printf` et non `echo` pour eviter les `\n`.
9. **i18n** : Les traductions sont dans `messages/`, les produits ont des champs `{ fr, en, es }`.
10. **Git** : Push sur `master` declenche le deploy auto Vercel.

---

## Mise a Jour de ce Fichier

Ce fichier (`CLAUDE.md`) doit etre mis a jour :
- Apres chaque bug fix important
- Apres ajout d'une nouvelle fonctionnalite
- Apres changement d'architecture ou de config
- Quand de nouvelles variables d'environnement sont ajoutees
- Quand un pattern de code important est etabli

**Derniere mise a jour** : 2026-02-10
