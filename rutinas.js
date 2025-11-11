document.addEventListener("DOMContentLoaded", function () {
    const buttonContainer = document.getElementById("nav-button-container");

    // Recuperar el rol desde localStorage
    const userRole = localStorage.getItem("role");
    if (userRole === "MAYOR" || userRole === "COACHES") {
        const button = document.createElement("a");
        button.className = "centered-button";
        button.href = "pruebas.html";
        button.textContent = "Ir a Pruebas";
        buttonContainer.appendChild(button);
    }

    // Asignar evento al botón del PDF
    const pdfButton = document.getElementById("show-snc-values");
    if (pdfButton) {
        pdfButton.addEventListener("click", () => {
            showPdfWithNavigation('informacion/Strength & Conditioning values.pdf');
        });
    }

    loadRoutineNames();
});

// Cargar las rutinas desde el archivo TSV
async function loadRoutineNames() {
    const response = await fetch('Rutinas.tsv');
    const tsvText = await response.text();

    const rows = tsvText.split('\n').map(row => row.split('\t'));
    rows.shift(); // Eliminar encabezado

    const list = document.getElementById('routine-list');
    const cutoffDate = new Date(2025, 2, 5); // 5 de marzo de 2025 (meses van de 0–11)

    // Filtrar y mapear las rutinas con sus fechas convertidas
    const routines = rows
        .map((row, index) => {
            const name = row[0];
            const dateMatch = name.match(/^(\d{2})\/(\d{2})\/(\d{4})/);

            if (name.trim().toUpperCase() === "MAYOR SELECCIÓN") {
                // Rutina especial sin importar fecha
                return { name, index, priority: 1, routineDate: new Date(9999, 11, 31) };
            }

            if (dateMatch) {
                const [_, day, month, year] = dateMatch;
                const routineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

                if (routineDate >= cutoffDate) {
                    return { name, index, priority: 0, routineDate };
                }
            }
            return null;
        })
        .filter(item => item !== null)
        .sort((a, b) => {
            // Primero mostrar "MAYOR SELECCIÓN", luego por fecha descendente
            if (b.priority !== a.priority) return b.priority - a.priority;
            return b.routineDate - a.routineDate;
        });

    // Agregar las rutinas ordenadas a la lista
    routines.forEach(({ name, index }) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `detallerutina.html?routine=${index}`;
        link.textContent = name;
        link.className = "button-link";
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
}






