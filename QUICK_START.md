# ⚡ Quick Start - Nature Pharmacy

## 🚀 Démarrage Rapide (en 3 étapes)

### 1️⃣ Ouvrir le terminal dans le bon dossier
```bash
cd "C:\Users\pc\Nature Pharmacy\nature-pharmacy"
```

### 2️⃣ Lancer le serveur de développement
```bash
npm run dev
```

### 3️⃣ Ouvrir dans le navigateur
```
http://localhost:3000/fr
```

✅ C'est tout ! Le site est maintenant accessible.

---

## 🎯 Accès Rapide aux Pages

| Page | URL | Description |
|------|-----|-------------|
| **Accueil FR** | http://localhost:3000/fr | Page d'accueil française |
| **Accueil EN** | http://localhost:3000/en | Page d'accueil anglaise |
| **Accueil ES** | http://localhost:3000/es | Page d'accueil espagnole |

---

## 📂 Fichiers Principaux à Modifier

### 🎨 Pour modifier le design de la page d'accueil
📁 **Fichier**: `app/[locale]/page.tsx`

Sections modifiables:
- Ligne 16-27: Bannière hero
- Ligne 34-52: Catégories
- Ligne 57-78: Produits en vedette
- Ligne 82-100: Section avantages

### 🔝 Pour modifier le Header (navigation)
📁 **Fichier**: `components/layout/Header.tsx`

Éléments modifiables:
- Ligne 30-35: Top bar
- Ligne 41-48: Logo
- Ligne 51-63: Barre de recherche
- Ligne 108-130: Menu de navigation

### 🔽 Pour modifier le Footer
📁 **Fichier**: `components/layout/Footer.tsx`

Sections modifiables:
- Ligne 13-19: Description
- Ligne 22-43: Liens rapides
- Ligne 46-62: Section vendeurs
- Ligne 65-86: Réseaux sociaux

### 🌍 Pour modifier les traductions
📁 **Fichiers**:
- `messages/fr.json` (Français)
- `messages/en.json` (Anglais)
- `messages/es.json` (Espagnol)

---

## 🖼️ Comment Ajouter vos Propres Images

### 1. Placer l'image dans le dossier public
```bash
# Copier votre image dans public/
cp /chemin/vers/votre/image.jpg public/mon-image.jpg
```

### 2. Utiliser l'image dans le code
```tsx
import Image from 'next/image';

<Image
  src="/mon-image.jpg"
  alt="Description"
  width={500}
  height={300}
/>
```

---

## 🎨 Personnaliser les Couleurs

### Couleurs actuelles du thème:
- **Vert principal**: `green-600` (#059669)
- **Vert foncé**: `green-700` (#047857)
- **Vert très foncé**: `green-800` (#065f46)

### Changer les couleurs dans le code:
Remplacez les classes Tailwind:
```tsx
// Avant
className="bg-green-600 text-white"

// Après (exemple: bleu)
className="bg-blue-600 text-white"
```

### Couleurs Tailwind disponibles:
- `blue-600` = Bleu
- `red-600` = Rouge
- `yellow-600` = Jaune
- `purple-600` = Violet
- `pink-600` = Rose
- `indigo-600` = Indigo

---

## 📝 Exemple: Ajouter un Nouveau Produit

### Dans `app/[locale]/page.tsx`:

Trouvez la ligne 59 et modifiez:
```tsx
{[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
  // Votre carte produit
))}
```

Remplacez par vos vrais produits:
```tsx
{[
  { id: 1, name: 'Huile d\'argan', price: 29.99, image: '/argan.jpg' },
  { id: 2, name: 'Miel naturel', price: 15.99, image: '/miel.jpg' },
].map((product) => (
  <div key={product.id} className="bg-white rounded-lg shadow-md">
    <Image src={product.image} alt={product.name} />
    <h3>{product.name}</h3>
    <p>${product.price}</p>
  </div>
))}
```

---

## 🛠️ Commandes Terminal Essentielles

### Démarrer le projet
```bash
npm run dev
```

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

### Redémarrer après modification
```bash
# Arrêtez avec Ctrl+C puis:
npm run dev
```

### Installer un nouveau package
```bash
npm install nom-du-package
```

### Voir tous les fichiers du projet
```bash
ls -la
```

---

## 🎓 Tutoriel: Modifier le Texte de la Bannière

### Étape 1: Ouvrir le fichier
📁 `app/[locale]/page.tsx`

### Étape 2: Trouver la section (ligne 16)
```tsx
<h1 className="text-5xl font-bold mb-6">
  Welcome to Nature Pharmacy
</h1>
```

### Étape 3: Modifier le texte
```tsx
<h1 className="text-5xl font-bold mb-6">
  Bienvenue sur Nature Pharmacie
</h1>
```

### Étape 4: Sauvegarder (Ctrl+S)

### Étape 5: Rafraîchir le navigateur (F5)
✅ Le changement est visible !

---

## 🌐 Changer la Langue par Défaut

### Ouvrir `middleware.ts` (ligne 8):
```ts
defaultLocale: 'fr',  // Langue par défaut
```

Changez en:
```ts
defaultLocale: 'en',  // Pour anglais
// ou
defaultLocale: 'es',  // Pour espagnol
```

---

## 📞 Besoin d'Aide ?

### Problème courant 1: "npm: command not found"
**Solution**: Installez Node.js depuis https://nodejs.org

### Problème courant 2: "Port 3000 already in use"
**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [numéro_du_processus] /F

# Ou changez le port
npm run dev -- -p 3001
```

### Problème courant 3: Le site ne se charge pas
**Solution**:
1. Vérifiez que le serveur tourne (`npm run dev`)
2. Vérifiez l'URL: http://localhost:3000/fr
3. Videz le cache du navigateur (Ctrl+Shift+Delete)

---

## ✅ Checklist Avant de Modifier

- [ ] Terminal ouvert dans le bon dossier
- [ ] Serveur de développement lancé (`npm run dev`)
- [ ] Navigateur ouvert sur http://localhost:3000/fr
- [ ] Éditeur de code ouvert (VS Code recommandé)
- [ ] Fichier à modifier identifié

---

## 🎉 Félicitations !

Vous savez maintenant comment :
- ✅ Démarrer le projet
- ✅ Naviguer dans les fichiers
- ✅ Modifier le contenu
- ✅ Personnaliser les couleurs
- ✅ Ajouter des images
- ✅ Changer les langues

**Prochaine étape**: Consultez `GUIDE_NAVIGATION.md` pour aller plus loin !
