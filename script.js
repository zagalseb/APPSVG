const FILE_PATH = "data.tsv"; // Ruta al archivo TSV

async function loadTSV() {
    try {
        const response = await fetch(FILE_PATH);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }

        const tsvData = await response.text();
        const rows = tsvData.trim().split("\n").map(row => row.split("\t"));

        renderTable(rows); // Mostrar todos los datos inicialmente
        setupFilter(rows); // Filtro por categoría
        setupWeekFilter(rows); // Filtro por semana
    } catch (error) {
        console.error("Error al cargar el archivo TSV:", error);
    }
}


// Renderizar la tabla con los datos proporcionados
function renderTable(rows) {
    const tbody = document.querySelector("#schedule tbody");
    tbody.innerHTML = ""; // Limpiar la tabla

    // Insertar las filas
    rows.forEach((row, index) => {
        // Omitir la cabecera en el cuerpo de la tabla
        if (index === 0) return;

        const tr = document.createElement("tr");
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell || "N/A"; // Manejar celdas vacías
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// Configurar el filtro de categorías
function setupFilter(rows) {
    const filter = document.getElementById("filter-category");
    filter.addEventListener("change", () => {
        const category = filter.value;

        // Filtrar los datos por categoría
        const filteredRows = category === "all"
            ? rows
            : rows.filter((row, index) => index === 0 || row[6] === category);

        // Renderizar la tabla con los datos filtrados
        renderTable(filteredRows);
    });
}

function getCurrentWeek() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDays = (today - startOfYear) / (24 * 60 * 60 * 1000); // Días transcurridos
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7); // Calcular la semana
}

console.log("Semana actual:", getCurrentWeek());

// Obtener el número de semana de una fecha
function getWeekNumber(dateString) {
    const date = new Date(dateString);
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = (date - startOfYear) / (24 * 60 * 60 * 1000);
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}

// Filtrar por semana actual
function filterByCurrentWeek(rows) {
    const currentWeek = getCurrentWeek(); // Semana actual

    return rows.filter((row, index) => {
        if (index === 0) return true; // Mantener el encabezado
        const weekNumber = getWeekNumber(row[2]); // Fecha Inicio en la columna 2
        return weekNumber === currentWeek;
    });
}

// Agregar filtro por semana
function setupWeekFilter(rows) {
    const weekFilter = document.getElementById("filter-week");
    weekFilter.addEventListener("change", () => {
        const showCurrentWeek = weekFilter.checked;
        const filteredRows = showCurrentWeek ? filterByCurrentWeek(rows) : rows;
        renderTable(filteredRows);
    });
}


// Cargar el archivo TSV al cargar la página
loadTSV();




