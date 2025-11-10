import { buildApiUrl } from "./config.js";

// Ahora consultamos al backend que actúa como proxy para la API externa
const API_BASE = "http://localhost:3001";

// Estrategia rápida y fiable: geocodificamos en el cliente con Nominatim
// y luego llamamos al backend con latitude & longitude (el upstream responde mejor a coords).
export async function useFetch(ciudad) {
  if (!ciudad) {
    throw new Error("Se requiere especificar una ciudad");
  }

  try {
    // 1) Intentar geocodificar la ciudad usando Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      ciudad
    )}`;
    const geoResp = await fetch(nominatimUrl, {
      headers: { "User-Agent": "project-sistemas-d/1.0 (contact)" },
    });

    if (!geoResp.ok) {
      console.warn("Nominatim devuelto status", geoResp.status);
      // fallback: llamar al backend con nombre de ciudad (el backend también tiene fallback interno)
      const urlByName = `${API_BASE}/api/weather?place=${encodeURIComponent(
        ciudad
      )}`;
      return await fetchWeatherUrl(urlByName);
    }

    const geoJson = await geoResp.json();
    if (Array.isArray(geoJson) && geoJson.length > 0) {
      const { lat, lon } = geoJson[0];
      const urlByCoords = `${API_BASE}/api/weather?latitude=${encodeURIComponent(
        lat
      )}&longitude=${encodeURIComponent(lon)}`;
      return await fetchWeatherUrl(urlByCoords);
    }

    // Si Nominatim no devolvió resultados, usamos el fallback por nombre
    const urlFallback = `${API_BASE}/api/weather?place=${encodeURIComponent(
      ciudad
    )}`;
    return await fetchWeatherUrl(urlFallback);
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
}

async function fetchWeatherUrl(url) {
  const response = await fetch(url, { method: "GET" });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Se ha excedido el límite de peticiones a la API. Por favor, espera unos minutos antes de intentar nuevamente."
      );
    }
    const text = await response.text();
    throw new Error(`Error del servidor: ${response.status} - ${text}`);
  }

  const data = await response.json();
  return data;
}
