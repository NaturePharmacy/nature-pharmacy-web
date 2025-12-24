# ⚡ Déploiement Rapide - Bluehost

## 1. SSH
```bash
ssh iboffromy@50.6.19.21
```

## 2. Clone
```bash
cd /home1/iboffromy
git clone https://github.com/VOTRE-REPO/nature-pharmacy.git
cd nature-pharmacy
```

## 3. Config
```bash
nano .env.production
```

Collez:
```env
MONGODB_URI=mongodb+srv://naturepharm_db_user:6Dl0TORBT68tEWsh@cluster0.fzzhugg.mongodb.net/nature-pharmacy?retryWrites=true&w=majority&appName=Cluster0
NEXTAUTH_URL=https://ibo.fro.mybluehost.me
NEXTAUTH_SECRET=PHTDTccZG68MO/HJWgV4u1JF6GxUU6Tamrj5s/V9vdc=
SITE_PASSWORD=clientpreview2024
```

Sauvegardez: `Ctrl+O`, `Enter`, `Ctrl+X`

## 4. Install & Build
```bash
npm install
npm run build
```

## 5. Démarrer
```bash
npm install -g pm2
pm2 start npm --name "nature-pharmacy" -- start
pm2 save
pm2 startup
```

## 6. Accéder
**URL**: https://ibo.fro.mybluehost.me
**Mot de passe**: clientpreview2024

## Commandes Utiles
```bash
pm2 status                    # État
pm2 logs nature-pharmacy      # Logs
pm2 restart nature-pharmacy   # Redémarrer
```

## Désactiver Protection
```bash
nano .env.production
# Commentez: # SITE_PASSWORD=clientpreview2024
pm2 restart nature-pharmacy
```
