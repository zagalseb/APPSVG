async function loadRoutineDetails() {
    const params = new URLSearchParams(window.location.search);
    const routineIndex = params.get('routine'); // Índice de la rutina desde la URL

    // Leer el archivo TSV
    const response = await fetch('Rutinas.tsv');
    const tsvText = await response.text();

    // Procesar el TSV
    const rows = tsvText.split('\n').map(row => row.split('\t')); // Dividir en filas y columnas
    const headers = rows.shift(); // Extraer encabezados
    const routine = rows[routineIndex]; // Obtener la rutina correspondiente

    console.log("Headers:", headers); // Mostrar encabezados para verificar errores
    console.log("Routine:", routine); // Mostrar datos de la rutina

    // Crear el contenedor de la tabla
    const container = document.getElementById('routine-details');
    const table = document.createElement('table');
    table.className = 'routine-table';

    // Warm Up
    const warmUpRow = table.insertRow();
    const warmUpCell = warmUpRow.insertCell();
    warmUpCell.colSpan = 4;
    warmUpCell.className = 'table-section-header';
    warmUpCell.textContent = `Warm Up: ${routine[headers.indexOf('Warm Up')]}`;

    // Encabezado de la tabla
    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>Estación</th>
        <th>Ejercicio</th>
        <th>Series/Reps</th>
        <th>%</th>
    `;

    // Estación 1: Ejercicios 1.1 y 1.2
    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '1';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 1.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 1.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 1.${i}`)];
    }

    // Intermedio 1
    const intermedio1Row = table.insertRow();
    const intermedio1Cell = intermedio1Row.insertCell();
    intermedio1Cell.colSpan = 4;
    intermedio1Cell.className = 'table-section-header';
    intermedio1Cell.textContent = `Intermedio 1: ${routine[headers.indexOf('Intermedio 1')]}`;

    // Estación 2: Ejercicios 2.1 y 2.2
    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '2';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 2.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 2.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 2.${i}`)];
    }

    // Intermedio 2
    const intermedio2Row = table.insertRow();
    const intermedio2Cell = intermedio2Row.insertCell();
    intermedio2Cell.colSpan = 4;
    intermedio2Cell.className = 'table-section-header';
    intermedio2Cell.textContent = `Intermedio 2: ${routine[headers.indexOf('Intermedio 2')]}`;

    // Estación 3: Ejercicios 3.1 y 3.2
    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '3';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 3.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 3.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 3.${i}`)];
    }

    // Extra
    const extraIndex = headers.findIndex(header => header.trim().toLowerCase() === 'extra'); // Ajuste para buscar correctamente
    const extraRow = table.insertRow();
    const extraCell = extraRow.insertCell();
    extraCell.colSpan = 4;
    extraCell.className = 'table-section-header';
    extraCell.textContent = `Extra: ${routine[extraIndex]}`;

    // Observaciones
    const observacionesIndex = headers.findIndex(header => header.trim().toLowerCase() === 'observaciones'); // Buscar encabezado "Observaciones"
    if (observacionesIndex !== -1) { // Validar que la columna "Observaciones" exista
        const observacionesRow = table.insertRow();
        const observacionesCell = observacionesRow.insertCell();
        observacionesCell.colSpan = 4;
        observacionesCell.className = 'table-section-header';
        observacionesCell.textContent = `Observaciones: ${routine[observacionesIndex]}`;
    } else {
        console.warn('El encabezado "Observaciones" no se encontró en el archivo TSV.');
    }


    

    // Agregar la tabla al contenedor
    container.appendChild(table);
}

// Ejecutar la función
loadRoutineDetails();