// Traduction des codes météo WMO d'Open-Meteo en texte français et icône
function traduireCodeMeteo(code) {
  if (code === 0) return { texte: "Ciel dégagé", icone: "☀️" };
  if (code >= 1 && code <= 3) return { texte: "Partiellement nuageux", icone: "⛅" };
  if (code === 45 || code === 48) return { texte: "Brouillard", icone: "🌫️" };
  if (code >= 51 && code <= 67) return { texte: "Pluie", icone: "🌧️" };
  if (code >= 71 && code <= 77) return { texte: "Neige", icone: "❄️" };
  if (code >= 80 && code <= 82) return { texte: "Averses", icone: "🌦️" };
  if (code >= 95) return { texte: "Orage", icone: "⛈️" };
  return { texte: "Conditions variables", icone: "🌤️" };
}

async function chargerMeteo() {
  try {
    // 1. Lire le fichier de configuration conf.json
    const reponseConfig = await fetch("./conf.json");
    if (!reponseConfig.ok) throw new Error("Impossible de lire conf.json");
    const config = await reponseConfig.json();
    const ville = config.ville;

    // 2. Récupérer les coordonnées GPS de la ville via l'API Geocoding d'Open-Meteo
    const urlGeo = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ville)}&count=1&language=fr&format=json`;
    const reponseGeo = await fetch(urlGeo);
    const dataGeo = await reponseGeo.json();

    if (!dataGeo.results || dataGeo.results.length === 0) {
      throw new Error(`Ville introuvable : ${ville}`);
    }

    const { latitude, longitude, name, country_code } = dataGeo.results[0];

    // 3. Récupérer la météo actuelle via l'API Forecast d'Open-Meteo
    const urlMeteo = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code`;
    const reponseMeteo = await fetch(urlMeteo);
    const dataMeteo = await reponseMeteo.json();
    const actuel = dataMeteo.current;

    // 4. Mettre à jour l'interface (DOM)
    const etatMeteo = traduireCodeMeteo(actuel.weather_code);

    document.getElementById("weather-icon").textContent = etatMeteo.icone;
    document.getElementById("temperature").textContent = `${Math.round(actuel.temperature_2m)}°C`;
    document.getElementById("description").textContent = etatMeteo.texte;
    document.getElementById("city-name").textContent = `📍 ${name}, ${country_code}`;
    document.getElementById("feels-like").textContent = `${Math.round(actuel.apparent_temperature)}°C`;
    document.getElementById("humidity").textContent = `${actuel.relative_humidity_2m}%`;

    // Afficher l'heure de la dernière actualisation
    const maintenant = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    document.getElementById("last-update").textContent = `MàJ ${maintenant}`;

    console.log(`[Météo] Données mises à jour pour ${name} à ${maintenant}`, actuel);
  } catch (erreur) {
    console.error("Erreur lors du chargement de la météo :", erreur);
    document.getElementById("description").textContent = "Erreur de chargement des données";
  }
}

// Lancement immédiat au chargement de la page
chargerMeteo();

// Actualisation automatique toutes les heures (1h = 60 min * 60 sec * 1000 ms)
const UNE_HEURE_EN_MS = 60 * 60 * 1000;
setInterval(chargerMeteo, UNE_HEURE_EN_MS);
