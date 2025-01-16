// Datos de usuarios y roles
const users = {
    Mayor: { password: "Wearecomingforyou25", role: "MAYOR" },
    Juvenil: { password: "Svg25", role: "JUVENIL" },
    COACHES: { password: "Staff2025", role: "COACHES" }
};

// Manejo de inicio de sesión
document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value; // Cambiado: Mantener formato ingresado
    const password = document.getElementById("password").value;

    // Validar credenciales
    if (users[username] && users[username].password === password) {
        const role = users[username].role;
        localStorage.setItem("role", role); // Guardar rol en localStorage
        window.location.href = "index.html"; // Redirigir al index
    } else {
        document.getElementById("login-error").style.display = "block"; // Mostrar error
    }
});


