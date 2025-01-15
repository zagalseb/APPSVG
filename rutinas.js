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
        listItem.appendChild(link);
        list.appendChild(listItem);
    });
}

loadRoutineNames();

