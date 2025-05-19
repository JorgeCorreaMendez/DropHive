
fetch("/get_log_file")
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo cargar el fichero: " + response.status);
        }
        return response.text();
    })
    .then(data => {
        const infoLines = data.split('\n')
            .filter(line => line.includes("INFO") && !line.includes("ERROR"));

        const parsedLogs = infoLines.map(line => {
            const match = line.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}),\d+ - INFO - \[user: (.*?)] - (.*)$/);
            if (!match) return null;
            const [, date, time, user, action] = match;
            return { date, time, user, action };
        }).filter(entry => entry !== null);

        const tbody = document.getElementById("log-table");
        parsedLogs.forEach(({ date, time, user, action }) => {
            const row = document.createElement("tr");
            [date, time, user, action].forEach(text => {
                const td = document.createElement("td");
                td.innerHTML = `<div class="cell">${text}</div>`;
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    })
    .catch(error => {
        console.error("Error al obtener el fichero:", error);
    });
