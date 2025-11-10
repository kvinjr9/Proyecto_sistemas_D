import { Router } from "express";

const router = Router();

// /api/weather?place=Ciudad  OR /api/weather?latitude=..&longitude=..
router.get("/weather", async (req, res) => {
  // accept either 'place' or both 'latitude' and 'longitude'
  const place = req.query.place ? String(req.query.place).trim() : null;
  const lat = req.query.latitude ? String(req.query.latitude).trim() : null;
  const lon = req.query.longitude ? String(req.query.longitude).trim() : null;

  if (!place && !(lat && lon)) {
    return res
      .status(400)
      .json({ message: "Missing place or latitude/longitude parameters" });
  }

  const apiKey = process.env.WEATHER_API_KEY;
  const apiHost = process.env.WEATHER_API_HOST;
  const apiUrl = process.env.WEATHER_API_URL;

  console.log("Incoming weather req.query:", req.query);

  if (!apiKey || !apiHost || !apiUrl) {
    return res
      .status(500)
      .json({ message: "Weather API not configured on server" });
  }

  try {
    // Build the upstream URL and forward all query params received from the client.
    const url = new URL(apiUrl);

    // Map known friendly params to the upstream API's expected params.
    // open-weather13 expects 'q' for city name, or 'lat' & 'lon' for coordinates.
    if (place) {
      // First attempt a free geocoding using Nominatim (OpenStreetMap) to obtain lat/lon.
      // This avoids relying on the upstream provider to geocode the city name.
      try {
        const geoResp = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            place
          )}`,
          { headers: { "User-Agent": "project-sistemas-d/1.0 (contact)" } }
        );

        if (geoResp.ok) {
          const geoJson = await geoResp.json();
          if (Array.isArray(geoJson) && geoJson.length > 0) {
            const g = geoJson[0];
            const gLat = String(g.lat);
            const gLon = String(g.lon);
            // upstream expects 'latitude' & 'longitude'
            url.searchParams.append("latitude", gLat);
            url.searchParams.append("longitude", gLon);
          } else {
            // If Nominatim found nothing, fall back to upstream geocoding using the city name (param 'q')
            console.warn(
              "Nominatim returned no results for",
              place,
              "; falling back to q=place"
            );
            url.searchParams.append("q", place);
          }
        } else {
          // If geocoding service failed, fall back to sending the place as 'q' to the upstream provider.
          console.warn(
            "Nominatim geocoding error (status",
            geoResp.status,
            ") - falling back to q=place"
          );
          url.searchParams.append("q", place);
        }
      } catch (geoErr: any) {
        console.error("Geocoding error:", geoErr, "; falling back to q=place");
        // On any geocoding exception, fallback to using the place string directly.
        url.searchParams.append("q", place);
      }
    } else if (lat && lon) {
      // If client already provided latitude/longitude, forward those names.
      url.searchParams.append("latitude", lat);
      url.searchParams.append("longitude", lon);
    }

    // Forward any other query params unchanged (except we avoid forwarding 'place', 'latitude', 'longitude' twice).
    for (const [key, value] of Object.entries(req.query)) {
      if (["place", "latitude", "longitude"].includes(key)) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, String(v)));
      } else if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    }

    console.log("Upstream URL:", url.toString());
    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        Accept: "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res
        .status(resp.status)
        .json({ message: "Upstream error", details: text });
    }

    const data = await resp.json();
    return res.json(data);
  } catch (err: any) {
    console.error("Error fetching weather:", err);
    return res.status(500).json({ message: "Error fetching weather data" });
  }
});

export default router;
