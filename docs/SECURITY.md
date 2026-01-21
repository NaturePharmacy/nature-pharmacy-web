# Guide de Sécurité - Nature Pharmacy

Ce document détaille toutes les mesures de sécurité implémentées dans Nature Pharmacy.

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Rate Limiting](#rate-limiting)
3. [Headers de Sécurité](#headers-de-sécurité)
4. [Validation des données](#validation-des-données)
5. [Détection d'attaques](#détection-dattaques)
6. [Authentification](#authentification)
7. [CORS](#cors)
8. [Bonnes pratiques](#bonnes-pratiques)

---

## 🛡️ Vue d'ensemble

Nature Pharmacy implémente plusieurs couches de sécurité pour protéger l'application et les données des utilisateurs :

- ✅ **Rate Limiting** - Limite le nombre de requêtes par IP/utilisateur
- ✅ **Security Headers** - Headers HTTP de sécurité (HSTS, X-Frame-Options, etc.)
- ✅ **Input Validation** - Validation et sanitization des données entrantes
- ✅ **Attack Detection** - Détection de patterns d'attaque (SQL injection, XSS, etc.)
- ✅ **CORS** - Configuration restrictive du Cross-Origin Resource Sharing
- ✅ **HTTPS** - Forçage HTTPS en production
- ✅ **Session Security** - Gestion sécurisée des sessions utilisateur

---

## ⏱️ Rate Limiting

### Configuration

Le rate limiting est implémenté dans [lib/rateLimit.ts](../lib/rateLimit.ts) avec plusieurs presets :

| Preset | Limite | Fenêtre | Usage recommandé |
|--------|---------|---------|------------------|
| `STRICT` | 10 req | 1 min | Authentification, reset password |
| `STANDARD` | 30 req | 1 min | API endpoints généraux |
| `GENEROUS` | 100 req | 1 min | Endpoints publics read-only |
| `AUTH` | 5 req | 15 min | Login spécifiquement |
| `EMAIL` | 3 req | 1 heure | Envoi d'emails |
| `UPLOAD` | 10 req | 1 heure | Upload de fichiers |

### Utilisation dans une API route

#### Méthode 1 : Avec wrapper `withRateLimit`

```typescript
import { NextRequest } from 'next/server';
import { withRateLimit } from '@/lib/apiHelpers';
import { RateLimitPresets } from '@/lib/rateLimit';

export const POST = withRateLimit(
  async (request: NextRequest) => {
    // Your handler code
    const body = await request.json();

    // Process request...

    return NextResponse.json({ success: true });
  },
  RateLimitPresets.STANDARD
);
```

#### Méthode 2 : Manuellement

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, getRateLimitHeaders } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // Apply rate limit
  const rateLimitResult = await rateLimit(request, {
    limit: 10,
    window: 60,
  });

  if (!rateLimitResult.success) {
    const headers = getRateLimitHeaders(rateLimitResult);

    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers }
    );
  }

  // Continue with request...
}
```

### Rate Limit par utilisateur

```typescript
import { rateLimitByIpAndUser } from '@/lib/rateLimit';

const session = await getServerSession(authOptions);
const userId = session?.user?.id || null;

const rateLimitResult = await rateLimitByIpAndUser(
  request,
  userId,
  { limit: 30, window: 60 }
);
```

### Exclure des sources de confiance

```typescript
import { isTrustedSource } from '@/lib/rateLimit';

const rateLimitResult = await rateLimit(request, {
  limit: 30,
  window: 60,
  skip: (req) => isTrustedSource(req), // Skip webhooks, admin tokens
});
```

---

## 🔒 Headers de Sécurité

Les headers de sécurité sont appliqués automatiquement via le middleware [middleware.ts](../middleware.ts).

### Headers appliqués

| Header | Valeur | Protection |
|--------|---------|-----------|
| `X-Frame-Options` | `DENY` | Clickjacking |
| `X-Content-Type-Options` | `nosniff` | MIME sniffing |
| `X-XSS-Protection` | `1; mode=block` | XSS (legacy browsers) |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Fuite d'information |
| `Permissions-Policy` | Restrictif | Limitation features navigateur |
| `Strict-Transport-Security` | `max-age=63072000` | Force HTTPS |

### Content Security Policy (CSP)

Le CSP est disponible mais désactivé par défaut pour éviter les conflits avec le contenu dynamique.

Pour l'activer, modifiez [middleware.ts](../middleware.ts:50) :

```typescript
response = applySecurityHeaders(response, {
  csp: true, // Active CSP
});
```

**⚠️ Attention** : Testez soigneusement après activation. Le CSP peut bloquer :
- Scripts inline
- Styles inline
- Ressources externes non listées

---

## ✅ Validation des données

### Validation automatique avec schema

Utilisez `validateBody` de [lib/apiHelpers.ts](../lib/apiHelpers.ts) :

```typescript
import { validateBody, errorResponse, successResponse } from '@/lib/apiHelpers';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Define validation schema
  const validation = validateBody<{
    email: string;
    password: string;
    age: number;
  }>(body, {
    email: {
      type: 'email',
      required: true,
      sanitize: true,
    },
    password: {
      type: 'string',
      required: true,
      min: 8,
      custom: (value) => {
        const result = Validator.isValidPassword(value);
        return result.valid || result.errors[0];
      },
    },
    age: {
      type: 'number',
      required: false,
      min: 18,
      max: 120,
    },
  });

  if (!validation.valid) {
    return errorResponse('Validation failed', 400, validation.errors);
  }

  const { email, password, age } = validation.data!;

  // Process with validated data...
  return successResponse({ message: 'User created' });
}
```

### Classes de validation disponibles

#### `Sanitizer`

```typescript
import { Sanitizer } from '@/lib/security';

// Remove HTML tags and dangerous characters
const clean = Sanitizer.sanitizeHtml('<script>alert("xss")</script>Hello');
// → "Hello"

// Sanitize email
const email = Sanitizer.sanitizeEmail('  USER@EXAMPLE.COM  ');
// → "user@example.com"

// Prevent NoSQL injection
const query = Sanitizer.sanitizeMongoQuery({ $where: 'malicious' });
// → {} (operators starting with $ are removed)

// Validate and sanitize URL
const url = Sanitizer.sanitizeUrl('javascript:alert(1)');
// → null (dangerous protocol)

// Sanitize filename
const filename = Sanitizer.sanitizeFilename('../../etc/passwd');
// → "_._._.etc.passwd"
```

#### `Validator`

```typescript
import { Validator } from '@/lib/security';

// Email
Validator.isValidEmail('user@example.com'); // → true

// Password (8+ chars, upper, lower, number, special)
const passwordCheck = Validator.isValidPassword('Weak');
// → { valid: false, errors: ["Password must be at least 8 characters long", ...] }

// MongoDB ObjectId
Validator.isValidObjectId('507f1f77bcf86cd799439011'); // → true

// Phone number
Validator.isValidPhone('+33612345678'); // → true

// Price
Validator.isValidPrice(19.99); // → true
Validator.isValidPrice(19.999); // → false (max 2 decimals)
```

---

## 🚨 Détection d'attaques

### Détecteur automatique

La classe `AttackDetector` détecte les patterns malveillants :

```typescript
import { AttackDetector } from '@/lib/security';

const input = "1' OR '1'='1";
const result = AttackDetector.isSuspicious(input);

if (result.suspicious) {
  console.log(result.reason); // "SQL injection pattern detected"
  // Block request, log event, etc.
}
```

### Types d'attaques détectées

1. **SQL Injection**
   - Patterns: `OR`, `AND`, `UNION SELECT`, `DROP TABLE`, `--`, etc.

2. **XSS (Cross-Site Scripting)**
   - Patterns: `<script>`, `javascript:`, `on*=`, `<iframe>`, etc.

3. **Path Traversal**
   - Patterns: `../`, `..%2F`, `..\\`, etc.

4. **Command Injection**
   - Patterns: `;`, `|`, `` ` ``, `$()`, `${}`, etc.

### Détection automatique dans API routes

```typescript
import { detectMaliciousInput } from '@/lib/apiHelpers';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Check for malicious patterns
  if (detectMaliciousInput(body, request)) {
    return errorResponse('Malicious input detected', 400);
  }

  // Continue processing...
}
```

### Logging des événements de sécurité

```typescript
import { logSecurityEvent } from '@/lib/security';

logSecurityEvent('suspicious_activity', {
  endpoint: '/api/users',
  reason: 'Multiple failed login attempts',
}, request);
```

Les logs incluent automatiquement :
- 🔒 Emoji security
- Timestamp ISO
- IP (masquée pour RGPD)
- User-Agent (tronqué)
- Détails custom

---

## 🔐 Authentification

### Vérifier si l'utilisateur est connecté

```typescript
import { isAuthenticated, extractBearerToken } from '@/lib/security';

// Check session/token presence
if (!isAuthenticated(request)) {
  return errorResponse('Unauthorized', 401);
}

// Extract Bearer token if present
const token = extractBearerToken(request);
```

### Masquer les données sensibles dans les logs

```typescript
import { maskSensitiveData, hashData } from '@/lib/security';

const email = 'user@example.com';

console.log(maskSensitiveData(email, 4));
// → "user************"

console.log(hashData(email));
// → "a7b8c9d0e1f2g3h4" (hash SHA-256 tronqué)
```

---

## 🌐 CORS

### Configuration

CORS est configuré dans [lib/security.ts](../lib/security.ts) avec liste blanche d'origines.

Par défaut, seules ces origines sont autorisées :
- `NEXT_PUBLIC_BASE_URL` (depuis .env)
- Origines additionnelles dans `ALLOWED_ORIGINS` (séparées par virgules)

### Variables d'environnement

```env
# .env.local
NEXT_PUBLIC_BASE_URL=https://nature-pharmacy.com
ALLOWED_ORIGINS=https://nature-pharmacy.com,https://admin.nature-pharmacy.com
```

### Appliquer CORS manuellement

```typescript
import { applyCorsHeaders } from '@/lib/security';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: 'public' });

  // Apply CORS headers
  return applyCorsHeaders(response, request);
}
```

### Preflight requests (OPTIONS)

```typescript
export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return applyCorsHeaders(response, request);
}
```

---

## 📚 Bonnes pratiques

### ✅ DO

1. **Toujours valider les entrées utilisateur**
   ```typescript
   const validation = validateBody(body, schema);
   if (!validation.valid) {
     return errorResponse('Invalid input', 400, validation.errors);
   }
   ```

2. **Utiliser rate limiting sur tous les endpoints sensibles**
   ```typescript
   export const POST = withRateLimit(handler, RateLimitPresets.STRICT);
   ```

3. **Sanitizer les données avant stockage/affichage**
   ```typescript
   const cleanText = Sanitizer.sanitizeHtml(userInput);
   ```

4. **Logger les événements de sécurité**
   ```typescript
   logSecurityEvent('failed_login', { email: maskSensitiveData(email) }, request);
   ```

5. **Utiliser HTTPS en production**
   ```typescript
   // Middleware force HTTPS via HSTS header
   ```

6. **Vérifier les permissions**
   ```typescript
   if (session?.user?.role !== 'admin') {
     return errorResponse('Forbidden', 403);
   }
   ```

### ❌ DON'T

1. **Ne jamais exposer les secrets dans le code**
   ```typescript
   // ❌ BAD
   const apiKey = 'sk_live_xxxxx';

   // ✅ GOOD
   const apiKey = process.env.STRIPE_SECRET_KEY;
   ```

2. **Ne jamais logger les mots de passe**
   ```typescript
   // ❌ BAD
   console.log('Password:', password);

   // ✅ GOOD
   console.log('Password hash:', hashData(password));
   ```

3. **Ne pas faire confiance aux données client**
   ```typescript
   // ❌ BAD
   const userId = body.userId; // Can be manipulated

   // ✅ GOOD
   const userId = session.user.id; // From authenticated session
   ```

4. **Ne pas désactiver la validation**
   ```typescript
   // ❌ BAD
   const user = await User.create(body); // No validation

   // ✅ GOOD
   const validation = validateBody(body, userSchema);
   if (!validation.valid) return error;
   const user = await User.create(validation.data);
   ```

5. **Ne pas ignorer les erreurs de sécurité**
   ```typescript
   // ❌ BAD
   try {
     await dangerousOperation();
   } catch (e) {
     // Silent fail
   }

   // ✅ GOOD
   try {
     await dangerousOperation();
   } catch (e) {
     logSecurityEvent('operation_failed', { error: e.message }, request);
     return errorResponse('Operation failed', 500);
   }
   ```

---

## 🔍 Tests de sécurité

### Tester le rate limiting

```bash
# Test avec curl (10 requêtes rapides)
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/test
done

# La 11ème devrait retourner 429
curl -X POST http://localhost:3000/api/test
# → {"error":"Too many requests","retryAfter":45}
```

### Tester la détection d'attaques

```bash
# SQL Injection
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"query":"1 OR 1=1"}'
# → {"error":"Malicious input detected"}

# XSS
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"content":"<script>alert(1)</script>"}'
# → {"error":"Malicious input detected"}
```

### Vérifier les headers de sécurité

```bash
curl -I https://your-domain.com

# Devrait inclure:
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security: max-age=63072000
# etc.
```

---

## 📊 Monitoring

### Logs de sécurité

Les événements de sécurité sont loggés avec le format :

```
🔒 Security Event: {
  event: 'rate_limit_exceeded',
  timestamp: '2024-01-15T10:30:00.000Z',
  ip: '192.168****',
  userAgent: 'Mozilla/5.0...',
  limit: 10,
  window: 60
}
```

### Événements trackés

- ✅ Rate limit exceeded
- ✅ Malicious input detected
- ✅ Failed authentication
- ✅ Suspicious activity
- ✅ Unauthorized access attempts

### En production

Considérez l'intégration d'un service de monitoring :
- **Sentry** (errors + security events)
- **LogRocket** (session replay)
- **Datadog** (APM + logs)

---

## 🚀 Déploiement

### Checklist de sécurité pré-production

- [ ] Tous les endpoints sensibles ont rate limiting
- [ ] Validation des inputs sur toutes les routes
- [ ] Headers de sécurité activés
- [ ] HTTPS forcé (HSTS)
- [ ] Secrets en variables d'environnement (pas dans le code)
- [ ] CSP configuré et testé (optionnel)
- [ ] CORS restreint aux origines de confiance
- [ ] Monitoring d'erreurs configuré
- [ ] Logs de sécurité en place
- [ ] Tests de sécurité passés

### Variables d'environnement requises

```env
# Security
NEXTAUTH_SECRET=<random-32-char-string>
ADMIN_API_TOKEN=<admin-bearer-token>
ALLOWED_ORIGINS=https://your-domain.com

# Optional
SITE_PASSWORD=<site-password> # For private beta
```

---

## 📞 Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, veuillez nous contacter à :

**Email**: security@nature-pharmacy.com

Merci de ne pas divulguer publiquement avant que nous ayons pu corriger le problème.

---

**🛡️ La sécurité est la responsabilité de tous. Restez vigilants !**
