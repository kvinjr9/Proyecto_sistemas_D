import { useFetch } from "./useFetch.js";

const form = document.getElementById("form_city");
const inputCiudad = document.getElementById("text_city");
const inputMunicipio = document.getElementById("text_M");
const gradosElement = document.getElementById("grados");
const ciudadElement = document.getElementById("ciudad");
const zonaHElement = document.getElementById("Zonah");

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  try {
    const ciudad = inputCiudad.value;
    const municipio = inputMunicipio.value;

    if (!ciudad) {
      alert("Por favor, ingrese una ciudad");
      return;
    }

    // Mostrar estado de carga
    gradosElement.textContent = "Cargando...";
    ciudadElement.textContent = "Buscando...";
    zonaHElement.textContent = "";

    // Esperar unos segundos antes de hacer la petición (para evitar límite de rate)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const datos = await useFetch(ciudad);

    // Actualizar la interfaz con los datos
    if (datos && datos.main) {
      // Respuesta de tipo "current" (ej. OpenWeatherMap current)
      gradosElement.textContent = `${datos.main.temp}°C`;
      ciudadElement.textContent = `${ciudad}${
        municipio ? `, ${municipio}` : ""
      }`;
      zonaHElement.textContent = `GMT${datos.timezone >= 0 ? "+" : ""}${
        datos.timezone / 3600
      }`;
    } else if (datos && Array.isArray(datos.list) && datos.list.length > 0) {
      // Respuesta de forecast (por ejemplo fivedaysforcast) — usamos el primer elemento como aproximación
      const first = datos.list[0];
      if (first && first.main && first.main.temp !== undefined) {
        gradosElement.textContent = `${first.main.temp}°C`;
        ciudadElement.textContent = `${ciudad}${
          municipio ? `, ${municipio}` : ""
        }`;
        // Algunos proveedores ponen timezone en datos.city.timezone (segundos)
        const tz =
          datos.city && datos.city.timezone ? datos.city.timezone : null;
        zonaHElement.textContent = tz
          ? `GMT${tz >= 0 ? "+" : ""}${tz / 3600}`
          : "";
      } else {
        throw new Error("Datos del clima no disponibles");
      }
    } else {
      throw new Error("Datos del clima no disponibles");
    }
  } catch (error) {
    console.error("Error:", error);
    gradosElement.textContent = "Error";
    // Mostrar mensaje de error detallado si está disponible
    const message =
      error && error.message
        ? error.message
        : "No se pudo obtener la información";
    ciudadElement.textContent = message;
    zonaHElement.textContent = "";

    // Mostrar alerta con mensaje detallado (útil para debug)
    alert(message);
  }
});
