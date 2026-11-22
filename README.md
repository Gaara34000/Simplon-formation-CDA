# Météo dans les transports en commun — Projet CDA Simplon

Application web conçue pour les écrans d'information voyageurs (stations, bus, tramways), réalisée dans le cadre de la préparation au positionnement **Concepteur Développeur d'Applications (CDA) — Simplon** par **Saad Jarmouni**.

## Fonctionnalités
- **Configuration sans barre de recherche** : la ville affichée est définie dans `conf.json` par l'exploitant du réseau.
- **Données météo en direct** : récupération des coordonnées GPS et des prévisions actuelles via l'API ouverte **Open-Meteo** (température, ressenti, humidité, condition météo).
- **Actualisation automatique** : rafraîchissement programmé toutes les heures (`setInterval` sur 3 600 000 ms) avec horodatage visible (`MàJ HH:MM`).
- **Interface haute lisibilité** : carte contrastée adaptée aux écrans publics, habillée d'un arrière-plan code Java et d'un bandeau de présentation.

## Structure du dossier
```text
meteo-transports-simplon/
├── index.html   # Structure sémantique de l'écran d'affichage
├── style.css    # Mise en page responsive et contrastée
├── conf.json    # Paramétrage de la ville (ex: "Montpellier")
├── meteo.js     # Lecture du JSON, appels API fetch, mise à jour DOM & timer 1h
└── README.md    # Documentation du projet
```

## Lancement en local
L'application utilise `fetch('./conf.json')`. Pour éviter le blocage CORS des navigateurs sur le protocole `file://`, lancez le projet via un serveur local :
- **VS Code** : clic droit sur `index.html` > *Open with Live Server*.
- **Python** : `python -m http.server 8000` puis ouvrir `http://localhost:8000`.

## Changer de ville
Modifiez simplement la valeur de `"ville"` dans `conf.json` :
```json
{
  "ville": "Rennes"
}
```
