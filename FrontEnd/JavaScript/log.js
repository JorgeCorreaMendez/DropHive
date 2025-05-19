function renderLogs(logs) {
    const tbody = document.getElementById("log-table-body");
    tbody.innerHTML = "";
    logs.forEach(({ date, time, user, action }) => {
        const row = document.createElement("tr");
        [date, time, user, action].forEach(text => {
            const td = document.createElement("td");
            td.innerHTML = `<div class="cell">${text}</div>`;
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

fetch("/get_log_file")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load the file: " + response.status);
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

        const userFilter = document.getElementById("filter-user");
        const dateFilter = document.getElementById("filter-date");
        const sortSelect = document.getElementById("sort-log");

        const users = [...new Set(parsedLogs.map(log => log.user))];
        const dates = [...new Set(parsedLogs.map(log => log.date))];

        users.forEach(user => {
            const option = document.createElement("option");
            option.value = user;
            option.textContent = user;
            userFilter.appendChild(option);
        });

        dates.forEach(date => {
            const option = document.createElement("option");
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });

        function applyFilters() {
            const selectedUser = userFilter.value;
            const selectedDate = dateFilter.value;
            const sortDirection = sortSelect.value;

            let filtered = parsedLogs.filter(log => {
                const userMatch = selectedUser === "All" || log.user === selectedUser;
                const dateMatch = selectedDate === "All" || log.date === selectedDate;
                return userMatch && dateMatch;
            });

            filtered.sort((a, b) => {
                const aTime = `${a.date} ${a.time}`;
                const bTime = `${b.date} ${b.time}`;
                return sortDirection === "asc"
                    ? aTime.localeCompare(bTime)
                    : bTime.localeCompare(aTime);
            });

            renderLogs(filtered);
        }

        userFilter.addEventListener("change", applyFilters);
        dateFilter.addEventListener("change", applyFilters);
        sortSelect.addEventListener("change", applyFilters);
        applyFilters();
    })
    .catch(error => {
        console.error("Error fetching the file:", error);
    });
