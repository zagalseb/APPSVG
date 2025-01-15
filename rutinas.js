// Leer y procesar el archivo TSV
async function loadRoutines() {
    const response = await fetch('Rutinas.tsv');
    const tsvText = await response.text();

    // Parsear el archivo TSV
    const rows = tsvText.split('\n').map(row => row.split('\t'));
    const headers = rows.shift(); // Extraer encabezados

    // Crear una tabla para mostrar las rutinas
    const table = document.createElement('table');
    table.className = 'routine-table';

    // Crear encabezados de la tabla
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Crear cuerpo de la tabla
    const tbody = table.createTBody();
    rows.forEach(row => {
        const tableRow = tbody.insertRow();
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tableRow.appendChild(td);
        });
    });

    // Agregar la tabla al contenedor en el HTML
    document.getElementById('routine-container').appendChild(table);
}

// Ejecutar la función al cargar la página
loadRoutines();
