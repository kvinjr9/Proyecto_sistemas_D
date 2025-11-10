// Configuración de la API
const config = {
    apiKey: 'b62489c998mshcc0baec3285ea47p1f1c48jsn3508ad3034ae',
    apiHost: 'weather-api167.p.rapidapi.com',
    apiUrl: 'https://weather-api167.p.rapidapi.com/api/weather/forecast'
};

// Función para obtener las credenciales de la API de forma segura
export function getApiCredentials() {
    return {
        headers: {
            'x-rapidapi-key': config.apiKey,
            'x-rapidapi-host': config.apiHost,
            'Accept': 'application/json'
        }
    };
}

// Función para construir la URL de la API
export function buildApiUrl(ciudad) {
    const url = new URL(config.apiUrl);
    url.searchParams.append('place', encodeURIComponent(ciudad));
    url.searchParams.append('cnt', '3');
    url.searchParams.append('units', 'standard');
    url.searchParams.append('type', 'three_hour');
    url.searchParams.append('mode', 'json');
    url.searchParams.append('lang', 'es');
    return url.toString();
}