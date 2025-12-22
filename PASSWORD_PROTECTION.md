# 🔒 Protection par Mot de Passe - Guide Rapide

## Activation

Pour activer la protection par mot de passe (accès client uniquement):

1. Ajoutez cette ligne dans votre fichier `.env.production`:
   ```env
   SITE_PASSWORD=votre-mot-de-passe-ici
   ```

2. Redémarrez l'application

3. Tous les visiteurs devront entrer le mot de passe pour accéder au site

## Utilisation

- **Page de connexion**: `https://votre-domaine.com/fr/client-access`
- **Durée de session**: 7 jours après authentification
- **Langues supportées**: Français, Anglais, Espagnol

## Partage avec le Client

Envoyez ces informations à votre client:

```
🌿 Nature Pharmacy - Accès Prévisualisation

URL: https://votre-domaine.com
Mot de passe: [votre-mot-de-passe]

Le mot de passe est valide pendant 7 jours.
Après connexion, vous pourrez naviguer librement sur le site.
```

## Désactivation

Une fois que le client a validé le site:

1. Dans `.env.production`, supprimez ou commentez la ligne:
   ```env
   # SITE_PASSWORD=votre-mot-de-passe-ici
   ```

2. Redémarrez l'application

3. Le site devient accessible publiquement

## Fonctionnement Technique

- **Middleware**: Intercepte toutes les requêtes et vérifie l'authentification
- **Cookie sécurisé**: Cookie HTTP-only avec expiration de 7 jours
- **API de vérification**: `/api/auth/client-verify` valide le mot de passe
- **Redirection automatique**: Les visiteurs non authentifiés sont redirigés vers `/client-access`

## Fichiers concernés

- `middleware.ts` - Middleware de protection
- `app/[locale]/client-access/page.tsx` - Page de login
- `app/api/auth/client-verify/route.ts` - API de vérification
- `messages/*.json` - Traductions (fr, en, es)

## Sécurité

- ⚠️ Cette protection est temporaire, pour la phase de validation uniquement
- ⚠️ N'utilisez pas de mots de passe sensibles (pas de mot de passe personnel)
- ✅ Le cookie est sécurisé en production (HTTPS uniquement)
- ✅ Le mot de passe est vérifié côté serveur
