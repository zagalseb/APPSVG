document.addEventListener("DOMContentLoaded", async function () {
    const selector = document.getElementById("player-selector");
    const positionSelector = document.getElementById("position-selector");
    const positionImage = document.getElementById("position-image");

    let playerData = []; // Almacenará los datos completos del TSV
    let charts = {}; // Objeto para almacenar referencias a las gráficas


    // Función para cargar los datos del archivo TSV
    async function loadPlayers() {
        try {
            const response = await fetch('Pruebas CEM.tsv'); // Ruta del archivo TSV
            const tsvText = await response.text();
            const rows = tsvText.split('\n').map(row => row.split('\t'));

            // Guardar datos completos (incluye encabezados)
            playerData = rows;

            // Extraer nombres de los jugadores con sus posiciones
            const players = rows.slice(1).map(row => ({
                name: row[1],  // Nombre del jugador (columna 1)
                position: row[0] // Posición del jugador (columna 0)
            })).filter(player => player.name); // Filtrar jugadores con nombre válido

            // Agregar los nombres con posición al selector
            players.forEach(player => {
                const option = document.createElement("option");
                option.value = player.name; // Usar el nombre del jugador como valor
                option.textContent = `${player.name} (${player.position})`; // Mostrar nombre con posición
                selector.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar el archivo TSV:", error);
        }
    }

    // Función para mostrar los datos en la tabla según el jugador seleccionado
    function displayPlayerData(playerName) {
        const playerRow = playerData.find(row => row[1] === playerName);
        if (playerRow) {
            // Llenar la tabla con datos del jugador
            document.getElementById("peso-2025").textContent = playerRow[21] || "N/A";
            document.getElementById("40yd-2025").textContent = playerRow[5] || "N/A";
            document.getElementById("bench-2025").textContent = playerRow[10] || "N/A";
            document.getElementById("squat-2025").textContent = playerRow[14] || "N/A";
            document.getElementById("clean-2025").textContent = playerRow[18] || "N/A";

            document.getElementById("meta-peso-2025").textContent = playerRow[20] || "N/A";
            document.getElementById("meta-40yd-2025").textContent = playerRow[7] || "N/A";
            document.getElementById("meta-bench-2025").textContent = playerRow[11] || "N/A";
            document.getElementById("meta-squat-2025").textContent = playerRow[15] || "N/A";
            document.getElementById("meta-clean-2025").textContent = playerRow[19] || "N/A";

            document.getElementById("peso-2024").textContent = playerRow[23] || "N/A";
            document.getElementById("40yd-2024").textContent = playerRow[39] || "N/A";
            document.getElementById("bench-2024").textContent = playerRow[27] || "N/A";
            document.getElementById("squat-2024").textContent = playerRow[31] || "N/A";
            document.getElementById("clean-2024").textContent = playerRow[35] || "N/A";

            document.getElementById("peso-2023").textContent = playerRow[22] || "N/A";
            document.getElementById("40yd-2023").textContent = playerRow[38] || "N/A";
            document.getElementById("bench-2023").textContent = playerRow[25] || "N/A";
            document.getElementById("squat-2023").textContent = playerRow[29] || "N/A";
            document.getElementById("clean-2023").textContent = playerRow[33] || "N/A";

            // Actualizar todas las gráficas
            updateAllCharts({
                "chart-40yd": { label: "40 YD", data: [parseFloat(playerRow[38]) || 0, parseFloat(playerRow[39]) || 0, parseFloat(playerRow[5]) || 0] },
                "chart-peso": { label: "Peso", data: [parseFloat(playerRow[22]) || 0, parseFloat(playerRow[23]) || 0, parseFloat(playerRow[21]) || 0] },
                "chart-bench": { label: "Bench", data: [parseFloat(playerRow[25]) || 0, parseFloat(playerRow[27]) || 0, parseFloat(playerRow[10]) || 0] },
                "chart-squat": { label: "Squat", data: [parseFloat(playerRow[29]) || 0, parseFloat(playerRow[31]) || 0, parseFloat(playerRow[14]) || 0] },
                "chart-clean": { label: "Clean", data: [parseFloat(playerRow[33]) || 0, parseFloat(playerRow[35]) || 0, parseFloat(playerRow[18]) || 0] }
            });
        }
    }

    function updateAllCharts(dataSet) {
        Object.entries(dataSet).forEach(([chartId, { label, data }]) => {
            const ctx = document.getElementById(chartId)?.getContext('2d');
            if (!ctx) return;
    
            if (charts[chartId]) charts[chartId].destroy(); // Destruir gráfico previo
    
            // Convertir valores inválidos ("SM", "LESION", "SM JUVENIL") en 0
            const cleanData = data.map(value => (["SM", "LESION", "SM JUVENIL"].includes(value) ? 0 : parseFloat(value) || 0));
    
            // Evitar errores si no hay datos válidos
            if (cleanData.every(d => d === 0)) return;
    
            const minValue = Math.min(...cleanData);
            const maxValue = Math.max(...cleanData);
            let padding = (maxValue - minValue) * 0.10; // 10% de margen
    
            // 🛠️ Si todos los valores son iguales, agregar un pequeño margen fijo
            if (padding === 0) padding = maxValue * 0.10 || 1; 
    
            charts[chartId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2023', '2024', '2025'],
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: '#004080',
                        borderWidth: 2,
                        tension: 0,
                        pointRadius: 5,
                        pointBackgroundColor: '#004080',
                        pointBorderColor: 'white',
                        pointBorderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { display: true, position: 'top' } 
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            min: minValue - padding,
                            max: maxValue + padding,
                            grid: { display: true, color: "rgba(200, 200, 200, 0.3)" },
                            ticks: { font: { size: 10 } }
                        },
                        x: { 
                            grid: { display: false },
                            ticks: { font: { size: 10 } }
                        }
                    }
                }
            });
        });
    }
    
    

    // Evento al cambiar la selección del jugador
    selector.addEventListener("change", function () {
        const selectedPlayer = selector.value;
        if (selectedPlayer) displayPlayerData(selectedPlayer);
    });

    // Mostrar imagen según la posición seleccionada
    positionSelector.addEventListener("change", function () {
        const position = positionSelector.value;
        if (position) {
            positionImage.src = `posicion/${position}.png`; // Ruta de las imágenes
            positionImage.style.display = "block";
        } else {
            positionImage.style.display = "none";
        }
    });

    // Cargar los jugadores al inicio
    await loadPlayers();
});