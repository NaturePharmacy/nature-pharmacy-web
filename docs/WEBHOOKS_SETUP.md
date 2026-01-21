# Configuration des Webhooks de Paiement

Ce guide explique comment configurer les webhooks Stripe et PayPal pour Nature Pharmacy.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Webhooks Stripe](#webhooks-stripe)
3. [Webhooks PayPal](#webhooks-paypal)
4. [Variables d'environnement](#variables-denvironnement)
5. [Test en local](#test-en-local)
6. [Déploiement en production](#déploiement-en-production)
7. [Événements gérés](#événements-gérés)
8. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Les webhooks permettent aux plateformes de paiement (Stripe et PayPal) de notifier automatiquement votre application lorsque des événements importants se produisent (paiement réussi, remboursement, etc.).

### Endpoints disponibles

- **Stripe**: `https://votre-domaine.com/api/webhooks/stripe`
- **PayPal**: `https://votre-domaine.com/api/webhooks/paypal`

### Flux de paiement

```
1. Client initie le paiement → Stripe/PayPal
2. Paiement traité → Stripe/PayPal envoie webhook
3. Webhook reçu → Vérification signature
4. Commande mise à jour → Notifications envoyées
5. Client et vendeurs informés
```

---

## 💳 Webhooks Stripe

### 1. Créer le webhook dans Stripe Dashboard

1. Connectez-vous à [Stripe Dashboard](https://dashboard.stripe.com)
2. Allez dans **Developers → Webhooks**
3. Cliquez sur **Add endpoint**
4. Configurez:
   - **Endpoint URL**: `https://votre-domaine.com/api/webhooks/stripe`
   - **Description**: Nature Pharmacy - Payment Webhooks
   - **Version**: Latest API version
   - **Events to send**: Sélectionnez les événements suivants:

### Événements Stripe à activer

✅ **Paiements**
- `payment_intent.succeeded` - Paiement réussi
- `payment_intent.payment_failed` - Paiement échoué
- `payment_intent.canceled` - Paiement annulé

✅ **Remboursements**
- `charge.refunded` - Remboursement effectué

✅ **Checkout Sessions**
- `checkout.session.completed` - Session de paiement complétée

### 2. Récupérer le Signing Secret

Après création du webhook, Stripe affiche un **Signing secret** (commence par `whsec_...`).

Copiez-le et ajoutez-le à votre `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Configuration Stripe complète

```env
# Stripe Keys (Mode Test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# En production, utilisez les clés live:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
# STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## 💰 Webhooks PayPal

### 1. Créer le webhook dans PayPal

1. Connectez-vous à [PayPal Developer Dashboard](https://developer.paypal.com/dashboard)
2. Sélectionnez votre application (ou créez-en une)
3. Allez dans **Webhooks** (menu latéral)
4. Cliquez sur **Add Webhook**
5. Configurez:
   - **Webhook URL**: `https://votre-domaine.com/api/webhooks/paypal`
   - **Event types**: Sélectionnez les événements suivants:

### Événements PayPal à activer

✅ **Paiements**
- `PAYMENT.CAPTURE.COMPLETED` - Paiement capturé avec succès
- `PAYMENT.CAPTURE.DENIED` - Paiement refusé
- `PAYMENT.CAPTURE.PENDING` - Paiement en attente

✅ **Commandes**
- `CHECKOUT.ORDER.APPROVED` - Commande approuvée

✅ **Remboursements**
- `PAYMENT.CAPTURE.REFUNDED` - Remboursement effectué

### 2. Récupérer le Webhook ID

Après création, PayPal affiche un **Webhook ID**.

Copiez-le et ajoutez-le à votre `.env.local`:

```env
PAYPAL_WEBHOOK_ID=xxxxxxxxxxxxxxxxxx
```

### 3. Configuration PayPal complète

```env
# PayPal Credentials (Sandbox)
PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_WEBHOOK_ID=xxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox

# En production:
# PAYPAL_MODE=live
# Et utilisez les vraies credentials de l'app en production
```

---

## 🔐 Variables d'environnement

Créez ou mettez à jour votre fichier `.env.local`:

```env
# ========================================
# STRIPE CONFIGURATION
# ========================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# ========================================
# PAYPAL CONFIGURATION
# ========================================
PAYPAL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_SECRET_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYPAL_WEBHOOK_ID=xxxxxxxxxxxxxxxxxx
PAYPAL_MODE=sandbox

# ========================================
# DATABASE
# ========================================
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nature-pharmacy

# ========================================
# AUTHENTICATION
# ========================================
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://votre-domaine.com
```

**⚠️ Important**: Ne committez JAMAIS ce fichier sur Git ! Il est déjà dans `.gitignore`.

---

## 🧪 Test en local

### Option 1: Stripe CLI (Recommandé)

1. **Installer Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_linux_x86_64.tar.gz
   tar -xvf stripe_linux_x86_64.tar.gz
   ```

2. **Login à Stripe**:
   ```bash
   stripe login
   ```

3. **Forwarder les webhooks vers localhost**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. La CLI affiche un **webhook signing secret** temporaire. Ajoutez-le à `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

5. **Tester un événement**:
   ```bash
   stripe trigger payment_intent.succeeded
   ```

### Option 2: ngrok pour PayPal

PayPal nécessite une URL publique HTTPS. Utilisez ngrok:

1. **Installer ngrok**:
   ```bash
   # macOS
   brew install ngrok

   # Windows/Linux: télécharger depuis https://ngrok.com/download
   ```

2. **Lancer ngrok**:
   ```bash
   ngrok http 3000
   ```

3. **Copier l'URL HTTPS** (ex: `https://xxxx-xx-xx-xx-xx.ngrok.io`)

4. **Mettre à jour le webhook PayPal** avec cette URL:
   - `https://xxxx-xx-xx-xx-xx.ngrok.io/api/webhooks/paypal`

5. **Tester avec PayPal Sandbox**:
   - Créez une transaction de test
   - Vérifiez les logs dans votre terminal

---

## 🚀 Déploiement en production

### 1. Variables d'environnement de production

Sur Vercel, Netlify, ou votre hébergeur:

1. Allez dans **Settings → Environment Variables**
2. Ajoutez TOUTES les variables ci-dessus
3. Utilisez les clés **LIVE** (pas test/sandbox)

### 2. Mettre à jour les webhooks

#### Stripe (Production)

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com) (mode Live)
2. **Developers → Webhooks → Add endpoint**
3. URL: `https://votre-domaine-production.com/api/webhooks/stripe`
4. Activez les mêmes événements
5. Copiez le nouveau **Signing Secret** (production)
6. Mettez-le dans les variables d'environnement de production

#### PayPal (Production)

1. Créez une **app PayPal en mode Live** sur [PayPal Developer](https://developer.paypal.com)
2. Créez un webhook avec l'URL de production
3. Copiez les nouvelles credentials (Client ID, Secret, Webhook ID)
4. Configurez `PAYPAL_MODE=live` en production

### 3. Vérification

Après déploiement:

1. **Testez un paiement réel** (petite somme)
2. **Vérifiez les logs**:
   - Stripe: Dashboard → Developers → Webhooks → [votre webhook] → Attempts
   - PayPal: Developer Dashboard → Webhooks → [votre webhook] → Recent Events
3. **Vérifiez que la commande est mise à jour** dans votre base de données

---

## 📊 Événements gérés

### Stripe

| Événement | Action | Statut commande | Statut paiement |
|-----------|--------|----------------|----------------|
| `payment_intent.succeeded` | Paiement réussi | `processing` | `paid` |
| `payment_intent.payment_failed` | Paiement échoué | - | `failed` |
| `payment_intent.canceled` | Paiement annulé | `cancelled` | `cancelled` |
| `charge.refunded` | Remboursement | `cancelled` | `refunded` |
| `checkout.session.completed` | Session terminée | - | - |

### PayPal

| Événement | Action | Statut commande | Statut paiement |
|-----------|--------|----------------|----------------|
| `PAYMENT.CAPTURE.COMPLETED` | Paiement capturé | `processing` | `paid` |
| `PAYMENT.CAPTURE.DENIED` | Paiement refusé | - | `failed` |
| `PAYMENT.CAPTURE.PENDING` | Paiement en attente | - | `pending` |
| `CHECKOUT.ORDER.APPROVED` | Commande approuvée | - | - |
| `PAYMENT.CAPTURE.REFUNDED` | Remboursement | `cancelled` | `refunded` |

### Actions automatiques

Pour chaque événement traité:

1. ✅ **Commande mise à jour** dans MongoDB
2. ✅ **Notifications créées** pour acheteur et vendeurs
3. ✅ **Emails envoyés** (confirmation, échec, etc.)
4. ✅ **Logs console** avec emojis pour debugging

---

## 🔍 Dépannage

### Problème: Webhooks non reçus

**Vérifications**:
1. ✅ Endpoint URL correcte (HTTPS en production)
2. ✅ Secret webhook configuré dans `.env.local`
3. ✅ Application redémarrée après ajout des variables
4. ✅ Firewall/WAF ne bloque pas les requêtes

**Stripe**: Vérifiez dans Dashboard → Webhooks → Recent deliveries

**PayPal**: Vérifiez dans Developer Dashboard → Webhooks → Recent Events

### Problème: Signature invalide

```
❌ Webhook signature verification failed
```

**Solutions**:
- ✅ Vérifiez que `STRIPE_WEBHOOK_SECRET` ou `PAYPAL_WEBHOOK_ID` est correct
- ✅ Assurez-vous d'utiliser le secret du bon environnement (test vs live)
- ✅ Pour Stripe CLI en local, utilisez le secret temporaire affiché par la CLI

### Problème: Commande non trouvée

```
❌ Order not found: 123456
```

**Causes possibles**:
- L'`orderId` n'est pas passé dans les metadata du PaymentIntent/Order
- La commande n'existe pas en base de données

**Solution**:
Lors de la création du paiement, assurez-vous de passer l'`orderId` dans metadata:

```typescript
// Stripe
const paymentIntent = await stripe.paymentIntents.create({
  amount: 5000,
  currency: 'eur',
  metadata: {
    orderId: order._id.toString(), // ← Important !
  },
});

// PayPal
const order = await paypal.orders.create({
  purchase_units: [{
    custom_id: orderId, // ← Important !
    // ou invoice_id: orderId
  }],
});
```

### Problème: Logs manquants

**Activer les logs détaillés**:

Les webhooks loggent déjà dans la console avec des emojis:
- ✅ Succès
- ❌ Erreur
- ⚠️ Avertissement
- ℹ️ Information
- 💳 Paiement
- 🛒 Checkout

Vérifiez vos logs:
```bash
# En local
npm run dev

# En production (Vercel)
vercel logs --follow
```

---

## 🔒 Sécurité

### Bonnes pratiques

1. ✅ **Toujours vérifier la signature** des webhooks (déjà implémenté)
2. ✅ **Utiliser HTTPS** en production (obligatoire)
3. ✅ **Ne jamais exposer** les secrets dans le code
4. ✅ **Logger les événements** pour audit
5. ✅ **Implémenter idempotence** (un webhook peut être envoyé plusieurs fois)

### Vérification de signature

Le code vérifie automatiquement:

**Stripe**:
```typescript
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  webhookSecret
);
```

**PayPal**:
```typescript
const isValid = await verifyPayPalWebhook({
  transmissionId,
  transmissionTime,
  transmissionSig,
  certUrl,
  authAlgo,
  webhookId,
  body,
});
```

---

## 📞 Support

Si vous rencontrez des problèmes:

1. **Consultez les logs** de votre application
2. **Vérifiez les Recent Deliveries** dans Stripe/PayPal Dashboard
3. **Testez avec Stripe CLI** en local
4. **Contactez le support**:
   - Stripe: https://support.stripe.com
   - PayPal: https://developer.paypal.com/support

---

## ✅ Checklist de configuration

Avant de passer en production:

- [ ] Webhooks Stripe configurés (mode live)
- [ ] Webhooks PayPal configurés (mode live)
- [ ] Toutes les variables d'environnement ajoutées
- [ ] Test d'un paiement réel effectué
- [ ] Commande correctement mise à jour en BD
- [ ] Notifications reçues par acheteur et vendeurs
- [ ] Emails envoyés avec succès
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] Webhook Signing Secrets sauvegardés en lieu sûr

---

**✨ Vos webhooks sont maintenant configurés ! Les paiements seront automatiquement traités et les commandes mises à jour en temps réel.**
