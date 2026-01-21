# Guide de Monitoring d'Erreurs - Nature Pharmacy

Ce document explique le système de monitoring et tracking des erreurs implémenté dans Nature Pharmacy.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration Sentry (Recommandé)](#configuration-sentry-recommandé)
3. [Alternative: Système intégré](#alternative-système-intégré)
4. [Error Boundary React](#error-boundary-react)
5. [API de logging d'erreurs](#api-de-logging-derreurs)
6. [Utilisation](#utilisation)
7. [Analyse des erreurs](#analyse-des-erreurs)
8. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Nature Pharmacy dispose de **deux systèmes de monitoring d'erreurs** :

### Option 1: Sentry (Recommandé pour production)
- ✅ Service professionnel de monitoring
- ✅ Dashboard riche et puissant
- ✅ Alertes temps réel
- ✅ Source maps support
- ✅ Performance monitoring
- ✅ Session replay
- ❌ Coût (plan gratuit limité)

### Option 2: Système intégré (Gratuit)
- ✅ Complètement gratuit
- ✅ Stockage dans votre propre MongoDB
- ✅ Contrôle total des données
- ✅ Pas de limite de quota
- ❌ Moins de features qu'un service professionnel
- ❌ Dashboard basique (à construire)

---

## 🚀 Configuration Sentry (Recommandé)

### 1. Créer un compte Sentry

1. Allez sur [sentry.io](https://sentry.io)
2. Créez un compte gratuit
3. Créez un nouveau projet **Next.js**
4. Copiez votre **DSN** (Data Source Name)

### 2. Installer les dépendances

```bash
npm install @sentry/nextjs
```

### 3. Configurer Sentry

#### Wizard automatique (Recommandé)

```bash
npx @sentry/wizard@latest -i nextjs
```

Le wizard va :
- ✅ Créer `sentry.client.config.ts`
- ✅ Créer `sentry.server.config.ts`
- ✅ Créer `sentry.edge.config.ts`
- ✅ Modifier `next.config.js`
- ✅ Ajouter `.sentryclirc`

#### Configuration manuelle

Si vous préférez configurer manuellement, créez :

**sentry.client.config.ts**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    return event;
  },

  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
});
```

**sentry.server.config.ts**
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,

  beforeSend(event, hint) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.authorization;
    }
    return event;
  },
});
```

### 4. Variables d'environnement

Ajoutez à votre `.env.local` :

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
SENTRY_AUTH_TOKEN=xxxxx # Pour source maps upload (optionnel)
SENTRY_ORG=your-org-name
SENTRY_PROJECT=nature-pharmacy
```

### 5. Décommenter le code dans lib/sentry.ts

Ouvrez [lib/sentry.ts](../lib/sentry.ts) et décommentez les sections marquées :

```typescript
// Uncomment when @sentry/nextjs is installed:
/*
import * as Sentry from '@sentry/nextjs';
...
*/
```

### 6. Vérifier l'installation

```bash
npm run build
```

Si tout est configuré correctement, vous devriez voir :
```
✅ Sentry webpack plugin loaded
✅ Source maps will be uploaded to Sentry
```

### 7. Tester

```typescript
// Déclencher une erreur de test
throw new Error('Test Sentry Error');
```

Vérifiez que l'erreur apparaît dans votre dashboard Sentry.

---

## 🔧 Alternative: Système intégré

Si vous ne voulez pas utiliser Sentry, le système intégré est déjà fonctionnel.

### Comment ça marche

1. **Erreurs capturées côté client** → Envoyées à `/api/errors`
2. **Stockées dans MongoDB** dans la collection `errorlogs`
3. **Auto-supprimées après 90 jours** (TTL index)
4. **Consultables via API** (admin seulement)

### Pas de configuration requise !

Le système est prêt à l'emploi. Les erreurs sont automatiquement :
- Loggées en console
- Envoyées à `/api/errors` en production
- Stockées en base de données

### Accéder aux logs d'erreurs

#### Via API

```bash
# Récupérer les erreurs (admin)
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "https://your-domain.com/api/errors?page=1&limit=50"

# Récupérer uniquement les erreurs non résolues
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "https://your-domain.com/api/errors?resolved=false"

# Marquer une erreur comme résolue
curl -X PATCH \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"errorId":"123456","resolved":true,"notes":"Fixed in v2.1"}' \
  "https://your-domain.com/api/errors"

# Supprimer les erreurs résolues > 30 jours
curl -X DELETE \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  "https://your-domain.com/api/errors?olderThan=30"
```

#### Via MongoDB Compass

Connectez-vous à votre base de données et consultez la collection `errorlogs`.

### Variables d'environnement requises

```env
# Token pour accéder aux logs d'erreurs
ADMIN_API_TOKEN=your-secret-admin-token-here
```

Générer un token sécurisé :
```bash
openssl rand -base64 32
```

---

## 🛡️ Error Boundary React

### Qu'est-ce qu'un Error Boundary ?

Un Error Boundary est un composant React qui :
- Capture les erreurs JavaScript dans son arbre de composants enfants
- Affiche un UI de fallback au lieu de crasher toute l'application
- Logue l'erreur dans Sentry/système de monitoring

### Utilisation

Le Error Boundary est déjà intégré dans le layout principal, mais vous pouvez l'utiliser pour des sections spécifiques :

```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

export default function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Avec un fallback personnalisé

```typescript
<ErrorBoundary
  fallback={
    <div className="error-container">
      <h2>Oops! Une erreur est survenue</h2>
      <button onClick={() => window.location.reload()}>
        Recharger la page
      </button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### Comportement

**En développement :**
- Affiche les détails de l'erreur
- Stack trace visible
- Component stack visible

**En production :**
- UI user-friendly
- Pas de détails techniques
- Message "Notre équipe a été notifiée"
- Boutons : Try Again / Go Home / Reload Page

---

## 📡 API de logging d'erreurs

### POST /api/errors

Enregistre une erreur côté client.

**Request:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "error": {
    "name": "TypeError",
    "message": "Cannot read property 'x' of undefined",
    "stack": "TypeError: Cannot read property...\n  at Component..."
  },
  "context": {
    "userId": "123",
    "url": "https://example.com/products",
    "component": "ProductCard",
    "action": "addToCart"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Error logged successfully"
}
```

**Rate Limit:** 10 erreurs par minute par IP

### GET /api/errors (Admin)

Récupère les logs d'erreurs.

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Query params:**
- `page` (default: 1)
- `limit` (default: 50)
- `resolved` (true/false)

**Response:**
```json
{
  "errors": [
    {
      "_id": "...",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "environment": "production",
      "error": {
        "name": "TypeError",
        "message": "...",
        "stack": "..."
      },
      "context": { ... },
      "userAgent": "Mozilla/5.0...",
      "ip": "192.168...",
      "url": "https://...",
      "resolved": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 145,
    "pages": 3
  }
}
```

### PATCH /api/errors (Admin)

Marque une erreur comme résolue.

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Body:**
```json
{
  "errorId": "abc123",
  "resolved": true,
  "notes": "Fixed in version 2.1.0"
}
```

### DELETE /api/errors (Admin)

Supprime les anciennes erreurs résolues.

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Query params:**
- `olderThan` (days) - ex: 30 pour supprimer les erreurs résolues > 30 jours

---

## 💻 Utilisation

### Capturer une erreur manuellement

```typescript
import { captureException } from '@/lib/sentry';

try {
  // Code dangereux
  riskyOperation();
} catch (error) {
  captureException(error as Error, {
    userId: user.id,
    component: 'CheckoutPage',
    action: 'processPayment',
  });

  // Afficher un message à l'utilisateur
  toast.error('Une erreur est survenue');
}
```

### Capturer un message (non-error)

```typescript
import { captureMessage } from '@/lib/sentry';

// Log important event
captureMessage('User upgraded to premium', 'info', {
  userId: user.id,
  plan: 'premium',
});

// Warning
captureMessage('Low stock alert', 'warning', {
  productId: product.id,
  stock: product.stock,
});
```

### Ajouter un breadcrumb

Les breadcrumbs aident à comprendre ce qui s'est passé avant l'erreur :

```typescript
import { addBreadcrumb } from '@/lib/sentry';

function addToCart(product: Product) {
  addBreadcrumb(
    'Product added to cart',
    'user_action',
    'info',
    {
      productId: product.id,
      productName: product.name,
      price: product.price,
    }
  );

  // ... add to cart logic
}
```

### Définir le contexte utilisateur

```typescript
import { setUserContext, clearUserContext } from '@/lib/sentry';

// Après login
setUserContext({
  id: user.id,
  email: user.email,
  username: user.name,
  role: user.role,
});

// Après logout
clearUserContext();
```

**Note**: Le `ErrorTrackingProvider` fait déjà ça automatiquement avec la session NextAuth.

---

## 📊 Analyse des erreurs

### Avec Sentry

Le dashboard Sentry vous donne :
- **Issues** - Erreurs groupées par type
- **Releases** - Erreurs par version
- **Performance** - Temps de réponse API, transactions
- **Replays** - Session replay vidéo (voir ce que l'utilisateur a fait)
- **Alerts** - Notifications email/Slack quand ça casse

### Avec le système intégré

Créez vos propres dashboards en interrogeant MongoDB :

```javascript
// Erreurs les plus fréquentes
db.errorlogs.aggregate([
  { $match: { resolved: false } },
  {
    $group: {
      _id: "$error.message",
      count: { $sum: 1 },
      lastSeen: { $max: "$timestamp" }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// Erreurs par jour (7 derniers jours)
db.errorlogs.aggregate([
  {
    $match: {
      timestamp: {
        $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

// Erreurs par environnement
db.errorlogs.aggregate([
  {
    $group: {
      _id: "$environment",
      count: { $sum: 1 }
    }
  }
]);
```

---

## ✅ Bonnes pratiques

### DO ✅

1. **Capturer les erreurs attendues**
   ```typescript
   try {
     await api.call();
   } catch (error) {
     captureException(error, { component: 'MyComponent' });
     showUserFriendlyMessage();
   }
   ```

2. **Ajouter du contexte**
   ```typescript
   captureException(error, {
     userId: user.id,
     action: 'checkout',
     items: cart.items.length,
     totalPrice: cart.total,
   });
   ```

3. **Utiliser des Error Boundaries**
   ```typescript
   <ErrorBoundary>
     <CriticalComponent />
   </ErrorBoundary>
   ```

4. **Vérifier les erreurs régulièrement**
   - Consultez Sentry/logs quotidiennement
   - Triez par fréquence
   - Fixez les plus critiques en premier

5. **Nettoyer les erreurs résolues**
   ```bash
   # Supprimer les erreurs résolues > 30 jours
   curl -X DELETE -H "Authorization: Bearer TOKEN" \
     "/api/errors?olderThan=30"
   ```

### DON'T ❌

1. **Ne pas logger les erreurs attendues/normales**
   ```typescript
   // ❌ BAD
   try {
     user = await findUser();
   } catch {
     captureException(new Error('User not found')); // Normal flow!
   }

   // ✅ GOOD
   const user = await findUser();
   if (!user) {
     // Just return 404, don't log as error
     return notFound();
   }
   ```

2. **Ne pas exposer les stack traces aux utilisateurs**
   ```typescript
   // ❌ BAD
   catch (error) {
     alert(error.stack); // Expose implementation details
   }

   // ✅ GOOD
   catch (error) {
     captureException(error); // Log internally
     toast.error('Une erreur est survenue'); // User-friendly
   }
   ```

3. **Ne pas ignorer les erreurs silencieusement**
   ```typescript
   // ❌ BAD
   try {
     criticalOperation();
   } catch {
     // Silent fail - no logging!
   }

   // ✅ GOOD
   try {
     criticalOperation();
   } catch (error) {
     captureException(error);
     // Handle gracefully
   }
   ```

4. **Ne pas logger les données sensibles**
   ```typescript
   // ❌ BAD
   captureException(error, {
     password: user.password,
     creditCard: payment.card,
   });

   // ✅ GOOD
   captureException(error, {
     userId: user.id,
     paymentMethod: payment.method, // Just the method, not card details
   });
   ```

---

## 🚀 Checklist de mise en production

- [ ] Sentry configuré (ou système intégré testé)
- [ ] Variables d'environnement définies
- [ ] Error Boundary intégré dans le layout
- [ ] ErrorTrackingProvider ajouté
- [ ] Global error handlers activés
- [ ] Test d'erreur envoyé et reçu
- [ ] Dashboard Sentry/API testé
- [ ] Alertes configurées (Sentry)
- [ ] ADMIN_API_TOKEN sécurisé
- [ ] Source maps uploadées (Sentry)

---

## 📞 Support

En cas de problème avec le monitoring :

1. **Vérifier les logs console**
   - `✅ Error tracking initialized` devrait apparaître

2. **Tester l'envoi d'erreur**
   ```typescript
   throw new Error('Test Error');
   ```

3. **Vérifier MongoDB**
   - Collection `errorlogs` existe ?
   - Des erreurs enregistrées ?

4. **Vérifier Sentry (si utilisé)**
   - DSN correct ?
   - Projet configuré ?
   - Quota dépassé ?

---

**🔍 Le monitoring est votre filet de sécurité. Ne le négligez pas !**
