const FILE_PATH = "data.tsv"; // Ruta al archivo TSV

// Cargar el archivo TSV
async function loadTSV() {
    try {
        const response = await fetch(FILE_PATH);
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo: ${response.statusText}`);
        }

        const tsvData = await response.text();
        const rows = tsvData.trim().split("\n").map(row => row.split("\t"));

        renderTable(rows); // Mostrar todos los datos inicialmente
        setupFilter(rows); // Configurar filtro por categoría
        setupWeekFilter(rows); // Configurar filtro por semana actual
    } catch (error) {
        console.error("Error al cargar el archivo TSV:", error);
    }
}

// Ordenar las filas por la columna Fecha de comienzo
function sortRowsByDate(rows) {
    const header = rows[0]; // Mantener el encabezado
    const data = rows.slice(1); // Filas de datos

    data.sort((a, b) => {
        const dateA = new Date(a[2]); // Columna de Fecha de comienzo
        const dateB = new Date(b[2]);
        return dateA - dateB; // Orden ascendente
    });

    return [header, ...data]; // Retornar encabezado + filas ordenadas
}

// Renderizar la tabla con los datos proporcionados
function renderTable(rows) {
    const sortedRows = sortRowsByDate(rows); // Ordenar antes de renderizar
    const tbody = document.querySelector("#schedule tbody");
    tbody.innerHTML = ""; // Limpiar la tabla

    sortedRows.forEach((row, index) => {
        if (index === 0) return; // Ignorar encabezado

        const tr = document.createElement("tr");

        // Añadir la columna Día de la Semana
        const weekdayCell = document.createElement("td");
        const dateString = row[2]; // Fecha de comienzo (columna 2)
        weekdayCell.textContent = getWeekday(dateString) || "N/A";
        tr.appendChild(weekdayCell);

        // Resto de columnas
        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell || "N/A"; // Manejar celdas vacías
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

// Obtener el día de la semana
function getWeekday(dateString) {
    try {
        const [month, day, year] = dateString.split("/");
        const date = new Date(year, month - 1, day); // Crear fecha
        const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        return days[date.getDay()];
    } catch (error) {
        console.error("Error procesando la fecha:", dateString);
        return "N/A";
    }
}

// Calcular la semana actual
function getCurrentWeek() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

// Calcular el número de semana de una fecha
function getWeekNumber(dateString) {
    try {
        const [month, day, year] = dateString.split("/");
        const date = new Date(year, month - 1, day);
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + startOfYear.getDay() + 1) / 7);
    } catch (error) {
        console.error("Error procesando la fecha:", dateString);
        return -1;
    }
}

// Filtrar por semana actual
function filterByCurrentWeek(rows) {
    const currentWeek = getCurrentWeek();

    return rows.filter((row, index) => {
        if (index === 0) return true; // Mantener encabezado
        const weekNumber = getWeekNumber(row[2]); // Fecha de comienzo
        return weekNumber === currentWeek;
    });
}

function setupFilter(rows) {
    const filter = document.getElementById("filter-category");
    filter.addEventListener("change", () => {
        const category = filter.value;

        const filteredRows = category === "all"
            ? rows
            : rows.filter((row, index) => index === 0 || row[7] === category);

        renderGroupedByDay(filteredRows); // Usar renderizado agrupado
    });
}

function setupWeekFilter(rows) {
    const weekFilter = document.getElementById("filter-week");
    weekFilter.addEventListener("change", () => {
        const showCurrentWeek = weekFilter.checked;
        const filteredRows = showCurrentWeek ? filterByCurrentWeek(rows) : rows;
        renderGroupedByDay(filteredRows); // Usar renderizado agrupado
    });
}

function renderGroupedByDay(rows) {
    const container = document.getElementById("schedule-container");
    container.innerHTML = ""; // Limpiar el contenedor

    const grouped = {}; // Agrupar actividades por día
    const daysOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    rows.forEach((row, index) => {
        if (index === 0) return; // Ignorar encabezado

        const dateString = row[2]; // Fecha de comienzo
        const weekday = getWeekday(dateString) || "N/A";

        if (!grouped[weekday]) {
            grouped[weekday] = []; // Crear grupo si no existe
        }
        grouped[weekday].push({ date: dateString, row }); // Añadir actividad al grupo del día
    });

    // Crear contenido agrupado por días en el orden correcto
    daysOrder.forEach(day => {
        if (grouped[day]) {
            const daySection = document.createElement("div");
            daySection.classList.add("day-section");

            // Título del día con la primera fecha asociada
            const firstActivity = grouped[day][0];
            const dayTitle = document.createElement("h3");
            dayTitle.textContent = `${day} (${firstActivity.date})`; // Día y Fecha
            daySection.appendChild(dayTitle);

            // Lista de actividades del día
            const activitiesList = document.createElement("ul");
            grouped[day].forEach(({ row }) => {
                const activityItem = document.createElement("li");
                activityItem.textContent = `Personal: ${row[1]} | Hora: ${row[3]} - ${row[5]} | Asunto: ${row[7]} | Ubicación: ${row[8]}`;
                activitiesList.appendChild(activityItem);
            });

            daySection.appendChild(activitiesList);
            container.appendChild(daySection);
        }
    });
}




// Cargar el archivo TSV al inicio
loadTSV();





