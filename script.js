document.addEventListener("DOMContentLoaded", () => {
    const FILE_PATH = "data.tsv"; // Ruta al archivo TSV
    const currentRole = localStorage.getItem("role")?.toUpperCase(); // Obtener el rol del usuario desde localStorage

    // Redirigir si no hay rol
    if (!currentRole) {
        alert("Debes iniciar sesión primero.");
        window.location.href = "login.html"; // Redirigir a login si no hay rol
    }

    // Cargar el archivo TSV
    async function loadTSV() {
        try {
            const response = await fetch(FILE_PATH);
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }

            const tsvData = await response.text();
            const rows = tsvData.trim().split("\n").map(row => row.split("\t"));

            const filteredRows = filterByRole(rows); // Filtrar actividades por el rol del usuario
            setupWeekFilter(filteredRows); // Configurar filtro por semana actual

            // Renderizar actividades de esta semana y la siguiente por defecto
            const currentWeekRows = filterByCurrentWeek(filteredRows);
            const nextWeekRows = filterByNextWeek(filteredRows);

            renderGroupedByDay(currentWeekRows, "Actividades de Esta Semana");
            renderGroupedByDay(nextWeekRows, "Actividades de la Próxima Semana");
        } catch (error) {
            console.error("Error al cargar el archivo TSV:", error);
        }
    }

    // Filtrar actividades según el rol del usuario
    function filterByRole(rows) {
        return rows.filter((row, index) => {
            if (index === 0) return true; // Mantener encabezado
            const personal = row[1]?.toUpperCase(); // Columna de "PERSONAL"
            if (currentRole === "MAYOR") {
                return personal === "MAYOR" || personal === "GENERAL";
            } else if (currentRole === "JUVENIL") {
                return personal === "JUVENIL" || personal === "GENERAL";
            } else if (currentRole === "COACHES") {
                return true; // Los coaches pueden ver todo
            }
            return false;
        });
    }

    // Configurar el filtro de semana
    function setupWeekFilter(rows) {
        const weekFilter = document.getElementById("filter-week");
        if (!weekFilter) {
            console.error("No se encontró el checkbox con ID 'filter-week'.");
            return;
        }

        // Marcar el checkbox por defecto
        weekFilter.checked = true;

        weekFilter.addEventListener("change", () => {
            const showCurrentWeek = weekFilter.checked;

            // Aplicar filtros combinados
            const currentWeekRows = showCurrentWeek 
                ? filterByCurrentWeek(filterByRole(rows)) 
                : filterByRole(rows);
            const nextWeekRows = showCurrentWeek 
                ? filterByNextWeek(filterByRole(rows)) 
                : [];

            const container = document.getElementById("schedule-container");
            container.innerHTML = ""; // Limpiar contenido

            renderGroupedByDay(currentWeekRows, "Actividades de Esta Semana");
            if (nextWeekRows.length > 0) {
                renderGroupedByDay(nextWeekRows, "Actividades de la Próxima Semana");
            }
        });
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

    // Filtrar por próxima semana
    function filterByNextWeek(rows) {
        const currentWeek = getCurrentWeek();
        const nextWeek = currentWeek + 1;

        return rows.filter((row, index) => {
            if (index === 0) return true; // Mantener encabezado
            const weekNumber = getWeekNumber(row[2]); // Fecha de comienzo
            return weekNumber === nextWeek;
        });
    }

    // Renderizar actividades agrupadas por día
    function renderGroupedByDay(rows, title) {
        const container = document.getElementById("schedule-container");

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

        // Crear título de la sección
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = title;
        container.appendChild(sectionTitle);

        // Crear contenido agrupado por días en el orden correcto
        daysOrder.forEach(day => {
            if (grouped[day]) {
                const daySection = document.createElement("div");
                daySection.classList.add("day-section");
                daySection.style.border = "1px solid #0000FF"; // Borde azul
                daySection.style.margin = "10px 0";
                daySection.style.padding = "10px";

                // Título del día con fecha al lado
                const firstActivity = grouped[day][0];
                const dayTitle = document.createElement("h3");
                dayTitle.textContent = `${day} (${firstActivity.date})`;
                daySection.appendChild(dayTitle);

                // Lista de actividades
                const activitiesList = document.createElement("ul");
                grouped[day].forEach(({ row }) => {
                    const asuntoConSaltos = row[7].replace(/\\n/g, "<br>");
                    activityItem = document.createElement("li");
                    activityItem.innerHTML = `Personal: ${row[1]}<br>Hora: ${row[3]} - ${row[5]}<br>Asunto: ${row[0]}<br>Descripcion: ${asuntoConSaltos}<br>Ubicación: ${row[8]}<br>Fecha: ${row[2]}`;
                    activitiesList.appendChild(activityItem);
                });



                daySection.appendChild(activitiesList);
                container.appendChild(daySection);
            }
        });

        container.style.display = "block"; // Asegurarse de mostrar el contenedor
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

    // Iniciar la carga del archivo
    loadTSV();
});



