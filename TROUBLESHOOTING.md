# 🔧 Dépannage Nature Pharmacy

## Problème : Internal Server Error

### Causes possibles et solutions :

#### 1. Cache corrompu
```bash
# Supprimer le cache et node_modules
rm -rf .next
rm -rf node_modules
npm install
npm run dev
```

#### 2. Problème avec les fichiers de traduction
Vérifiez que ces fichiers existent :
- `messages/fr.json`
- `messages/en.json`
- `messages/es.json`

#### 3. Problème avec le fichier i18n/request.ts
Le fichier doit contenir :
```ts
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
```

#### 4. Vérifier les erreurs dans le terminal
Lorsque vous lancez `npm run dev`, regardez attentivement les messages d'erreur en rouge.

---

## Étapes de diagnostic complètes

### Étape 1 : Nettoyer complètement
```bash
cd "C:\Users\pc\Nature Pharmacy\nature-pharmacy"
rm -rf .next
rm -rf node_modules
npm cache clean --force
npm install
```

### Étape 2 : Vérifier la structure des fichiers
```bash
ls messages/
ls i18n/
ls app/[locale]/
```

Vous devriez voir :
- `messages/` : fr.json, en.json, es.json
- `i18n/` : request.ts
- `app/[locale]/` : layout.tsx, page.tsx

### Étape 3 : Lancer en mode verbose
```bash
npm run dev -- --verbose
```

### Étape 4 : Vérifier les logs
Regardez la console pour des messages comme :
- ✅ `Ready in X.Xs` = OK
- ❌ `Error:` = Problème
- ⚠️ `Warning:` = Attention

---

## Erreurs courantes

### Erreur : "Cannot find module '../messages/...'"
**Solution** : Le chemin dans `i18n/request.ts` est incorrect
```ts
// ❌ Mauvais
messages: (await import(`./messages/${locale}.json`))

// ✅ Bon
messages: (await import(`../messages/${locale}.json`))
```

### Erreur : "params must be awaited"
**Solution** : Utilisez `await params` dans layout.tsx et page.tsx
```ts
// ✅ Correct
export default async function Layout({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // ...
}
```

### Erreur : "Port 3000 is in use"
**Solution** : Utilisez un autre port
```bash
npm run dev -- -p 3001
```

---

## Commandes utiles

### Vérifier la version de Node
```bash
node --version
# Devrait être >= 18.x
```

### Vérifier la version de npm
```bash
npm --version
# Devrait être >= 9.x
```

### Réinstaller Next.js
```bash
npm install next@latest react@latest react-dom@latest
```

### Rebuild complet
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## Si rien ne fonctionne

1. **Redémarrez votre ordinateur**
2. **Vérifiez votre antivirus** (il peut bloquer npm)
3. **Exécutez PowerShell en tant qu'administrateur**
4. **Vérifiez votre connexion internet** (npm a besoin d'internet)

---

## Obtenir de l'aide

Si l'erreur persiste :
1. Copiez le message d'erreur complet
2. Notez à quelle étape l'erreur se produit
3. Vérifiez les fichiers modifiés récemment
