// Validación de formularios
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarContrasena(password) {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
}

const API_BASE = "http://localhost:3001";

async function handleLogin(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const correo = emailInput.value.trim();
    const clave = passwordInput.value;

    let mensaje = "";
    if (!validarEmail(correo))
      mensaje += "El correo electrónico no es válido\n";
    if (!validarContrasena(clave))
      mensaje +=
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número\n";
    if (mensaje) {
      alert(mensaje);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, clave }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error en login");

      // Guardar token y redirigir
      if (data.token) localStorage.setItem("token", data.token);
      alert(data.message || "Ingreso exitoso");
      window.location.href = "index.html";
    } catch (err) {
      console.error(err);
      alert("Error en la petición de login");
    }
  });
}

async function handleRegister(form) {
  const nombreInput = form.querySelector('input[name="nombre"]');
  const ciudadInput = form.querySelector('input[name="ciudad"]');
  const estadoInput = form.querySelector('input[name="estado"]');
  const emailInput = form.querySelector('input[type="email"]');
  const passwordInput = form.querySelector('input[type="password"]');

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nombre = nombreInput.value.trim();
    const ciudad = ciudadInput.value.trim();
    const estado = estadoInput.value.trim();
    const correo = emailInput.value.trim();
    const clave = passwordInput.value;

    let mensaje = "";
    if (nombre.length < 3)
      mensaje += "El nombre debe tener al menos 3 caracteres\n";
    if (ciudad.length < 2)
      mensaje += "La ciudad debe tener al menos 2 caracteres\n";
    if (estado.length < 2)
      mensaje += "El estado/municipio debe tener al menos 2 caracteres\n";
    if (!validarEmail(correo))
      mensaje += "El correo electrónico no es válido\n";
    if (!validarContrasena(clave))
      mensaje +=
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número\n";
    if (mensaje) {
      alert(mensaje);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, ciudad, estado, correo, clave }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Error en registro");
      alert(data.message || "Registro exitoso");
      window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert("Error en la petición de registro");
    }
  });
}

// Inicializar validación según la página
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
if (registerForm) handleRegister(registerForm);
if (loginForm) handleLogin(loginForm);
