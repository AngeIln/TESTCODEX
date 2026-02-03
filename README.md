# Supply Chain Rail Tycoon (Prototype Phaser 3)

Prototype avancé pour un jeu de tycoon ferroviaire basé sur une économie multi-niveaux (matières premières → usines → villes). Le projet est structuré en modules ES6 et tourne directement dans un navigateur.

## ✨ Fonctionnalités
- **Grille 50x50** avec rendu graphique détaillé par tuile.
- **Caméra pan/zoom** (drag & molette).
- **Placement d'infrastructures** (rails, gares, usines, villes).
- **Trains avec état et accélération/décélération**.
- **Économie + boucle de production** (bois/fer → planches → paiement ville).
- **HUD Bootstrap** avec outils et indicateurs de route.
- **Marché dynamique** avec évolution des prix (Chart.js).

## ✅ Pré-requis
- Un navigateur moderne (Chrome, Edge, Firefox).
- Python 3 (optionnel pour serveur local).

## ▶️ Lancer le prototype
### Option 1 : ouverture directe
Ouvrez simplement `index.html` dans votre navigateur.

### Option 2 : serveur local (recommandé)
```bash
python -m http.server 8000
```
Puis ouvrez : http://127.0.0.1:8000/index.html

## 🎮 Commandes
- **Click gauche** : placer l’outil actif.
- **Shift + Click** : définir le début/fin d’une route (gare → ville).
- **Drag** : déplacer la caméra.
- **Molette** : zoom.

## 🧱 Structure du projet
```
index.html
styles.css
src/
  constants.js
  EconomyManager.js
  GridManager.js
  MainScene.js
  MarketManager.js
  Pathfinder.js
  Renderer.js
  StationManager.js
  TrainEntity.js
  TrainManager.js
  ui.js
  main.js
```

## 🚧 À venir (idées)
- Système de signaux / aiguillages.
- IA de gestion logistique multi-trains.
- Marché dynamique (prix variables).
- Système de missions / objectifs.
- UI des stocks par bâtiment.
