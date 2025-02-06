document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.getElementById("nav-button-container");

    // Recuperar el rol desde localStorage
    const userRole = localStorage.getItem("role");

    if (userRole === "MAYOR" || userRole === "COACHES") {
        const button = document.createElement("a");
        button.className = "centered-button"; // Aplica la clase corregida
        button.href = "pruebas.html";
        button.textContent = "Ir a Pruebas";
        buttonContainer.appendChild(button);
    }
});


// Cargar las rutinas desde el archivo TSV
async function loadRoutineNames() {
    const response = await fetch('Rutinas.tsv');
    const tsvText = await response.text();

    // Parsear el archivo TSV
    const rows = tsvText.split('\n').map(row => row.split('\t'));
    rows.shift(); // Quitar encabezados

    // Crear lista de nombres de rutinas
    const list = document.getElementById('routine-list');
    rows.forEach((row, index) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `detallerutina.html?routine=${index}`;
        link.textContent = row[0]; // Nombre de la rutina
        link.className = "button-link"; // Aplicar el mismo estilo que otros botones
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
}

loadRoutineNames();



