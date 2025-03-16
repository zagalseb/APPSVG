async function loadRoutineDetails() {
    const params = new URLSearchParams(window.location.search);
    const routineIndex = params.get('routine');

    const response = await fetch('Rutinas.tsv');
    const tsvText = await response.text();

    const rows = tsvText.split('\n').map(row => row.split('\t'));
    const headers = rows.shift();
    const routine = rows[routineIndex];

    console.log('Headers:', headers);
    console.log('Routine:', routine);

    const container = document.getElementById('routine-details');
    const table = document.createElement('table');
    table.className = 'routine-table';

    const warmUpRow = table.insertRow();
    const warmUpCell = warmUpRow.insertCell();
    warmUpCell.colSpan = 4;
    warmUpCell.className = 'table-section-header';
    warmUpCell.textContent = `Warm Up: ${routine[headers.indexOf('Warm Up')]}`;

    const headerRow = table.insertRow();
    headerRow.innerHTML = `
        <th>Estación</th>
        <th>Ejercicio</th>
        <th>Series/Reps</th>
        <th>%</th>
    `;

    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '1';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 1.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 1.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 1.${i}`)];
    }

    const intermedio1Row = table.insertRow();
    const intermedio1Cell = intermedio1Row.insertCell();
    intermedio1Cell.colSpan = 4;
    intermedio1Cell.className = 'table-section-header';
    intermedio1Cell.textContent = `Intermedio 1: ${routine[headers.indexOf('Intermedio 1')]}`;

    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '2';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 2.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 2.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 2.${i}`)];
    }

    const intermedio2Row = table.insertRow();
    const intermedio2Cell = intermedio2Row.insertCell();
    intermedio2Cell.colSpan = 4;
    intermedio2Cell.className = 'table-section-header';
    intermedio2Cell.textContent = `Intermedio 2: ${routine[headers.indexOf('Intermedio 2')]}`;

    for (let i = 1; i <= 2; i++) {
        const row = table.insertRow();
        row.insertCell().textContent = '3';
        row.insertCell().textContent = routine[headers.indexOf(`Ejercicio 3.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`Serie-Reps 3.${i}`)];
        row.insertCell().textContent = routine[headers.indexOf(`% 3.${i}`)];
    }

    const extraIndex = headers.findIndex(header => header.trim().toLowerCase() === 'extra');
    const extraRow = table.insertRow();
    const extraCell = extraRow.insertCell();
    extraCell.colSpan = 4;
    extraCell.className = 'table-section-header';
    extraCell.textContent = `Extra: ${routine[extraIndex]}`;

    const observacionesIndex = headers.findIndex(header => header.trim().toLowerCase() === 'observaciones');
    if (observacionesIndex !== -1) {
        const observacionesRow = table.insertRow();
        const observacionesCell = observacionesRow.insertCell();
        observacionesCell.colSpan = 4;
        observacionesCell.className = 'table-section-header';
        observacionesCell.textContent = `Observaciones: ${routine[observacionesIndex]}`;
    }

    container.appendChild(table);

    // Mostrar imágenes
    const imagen1Index = headers.indexOf('Imagen 1');
    const imagen2Index = headers.indexOf('Imagen 2');

    console.log('Ruta Imagen 1:', routine[imagen1Index]);
    console.log('Ruta Imagen 2:', routine[imagen2Index]);

    if (imagen1Index !== -1 && imagen2Index !== -1) {
        const imagesContainer = document.getElementById('images-container');

        const createImageElement = (src, altText) => {
            if (!src.trim()) return null; // No mostrar si no hay imagen

            const img = document.createElement('img');
            img.src = src.trim();
            img.alt = altText;
            img.className = 'routine-image';
            return img;
        };

        const img1 = createImageElement(routine[imagen1Index], 'Imagen 1');
        const img2 = createImageElement(routine[imagen2Index], 'Imagen 2');

        if (img1) imagesContainer.appendChild(img1);
        if (img2) imagesContainer.appendChild(img2);
    }

}

// Ejecutar la función
loadRoutineDetails();

