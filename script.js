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

function getWeekday(dateString) {
    try {
        const [month, day, year] = dateString.split("/");
        const date = new Date(year, month - 1, day); // Crear fecha en formato MM/DD/YYYY
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return days[date.getDay()];
    } catch (error) {
        console.error("Error procesando la fecha:", dateString);
        return "N/A";
    }
}

function renderTable(rows) {
    const tbody = document.querySelector("#schedule tbody");
    tbody.innerHTML = ""; // Limpiar la tabla

    rows.forEach((row, index) => {
        // Ignorar el encabezado en las filas de datos
        if (index === 0) return;

        const tr = document.createElement("tr");

        // Añadir la columna "Día de la Semana" para las filas de datos
        const weekdayCell = document.createElement("td");
        const dateString = row[2]; // Suponiendo que "Fecha de comienzo" está en la columna 2
        weekdayCell.textContent = getWeekday(dateString) || "N/A";
        tr.appendChild(weekdayCell);

        // Renderizar el resto de las columnas
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

        const filteredRows = category === "all"
            ? rows
            : rows.filter((row, index) => index === 0 || row[7] === category); // Cambia el índice si tu categoría está en otra columna

        renderTable(filteredRows);
    });
}

function getCurrentWeek() {
    return dateFns.getWeek(new Date());
}

function getWeekNumber(dateString) {
    try {
        const date = dateFns.parse(dateString, "MM/dd/yyyy", new Date());
        return dateFns.getWeek(date);
    } catch (error) {
        console.error("Error procesando la fecha:", dateString);
        return -1; // Semana inválida
    }
}

function filterByCurrentWeek(rows) {
    const currentWeek = getCurrentWeek();

    return rows.filter((row, index) => {
        if (index === 0) return true;
        const weekNumber = getWeekNumber(row[2]);
        return weekNumber === currentWeek;
    });
}

function setupWeekFilter(rows) {
    const weekFilter = document.getElementById("filter-week");
    weekFilter.addEventListener("change", () => {
        const showCurrentWeek = weekFilter.checked;
        const filteredRows = showCurrentWeek ? filterByCurrentWeek(rows) : rows;
        renderTable(filteredRows);
    });
}

loadTSV();




