<?php
session_start();
require_once 'config/conexion.php';

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Obtener y limpiar datos del formulario
    $nombre = trim($_POST['nombre']);
    $ciudad = trim($_POST['ciudad']);
    $estado = trim($_POST['estado']);
    $correo = trim($_POST['correo']);
    $clave = $_POST['clave'];
    
    // Validaciones básicas
    if (empty($nombre) || empty($ciudad) || empty($estado) || empty($correo) || empty($clave)) {
        echo "<script>
            alert('Todos los campos son obligatorios');
            window.location.href = 'register.html';
        </script>";
        exit();
    }
    
    // Validar formato de correo
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
        echo "<script>
            alert('El formato del correo no es válido');
            window.location.href = 'register.html';
        </script>";
        exit();
    }
    
    // Validar longitud de contraseña
    if (strlen($clave) < 6) {
        echo "<script>
            alert('La contraseña debe tener al menos 6 caracteres');
            window.location.href = 'register.html';
        </script>";
        exit();
    }
    
    try {
        $pdo = conectarDB();
        
        // Verificar si el correo ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo = ?");
        $stmt->execute([$correo]);
        
        if ($stmt->rowCount() > 0) {
            echo "<script>
                alert('Este correo ya está registrado');
                window.location.href = 'register.html';
            </script>";
            exit();
        }
        
        // Encriptar contraseña
        $claveHash = password_hash($clave, PASSWORD_DEFAULT);
        
        // Insertar nuevo usuario
        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, ciudad, estado, correo, clave) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$nombre, $ciudad, $estado, $correo, $claveHash]);
        
        // REGISTRO EXITOSO - Aquí va el alert de éxito
        echo "<script>
            alert('¡Registro exitoso! Ya puedes iniciar sesión');
            window.location.href = 'login.html';
        </script>";
        exit();
        
    } catch (PDOException $e) {
        echo "<script>
            alert('Error al registrar usuario. Intenta nuevamente');
            window.location.href = 'register.html';
        </script>";
        exit();
    }
    
} else {
    header('Location: register.html');
    exit();
}
?>