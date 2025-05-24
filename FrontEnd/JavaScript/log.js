function renderLogs(logs) {
    const tbody = document.getElementById("log-table-body");
    tbody.innerHTML = logs.map(({date, time, user, action}) => `
        <tr>
            <td><div class="cell">${date}</div></td>
            <td><div class="cell">${time}</div></td>
            <td><div class="cell">${user}</div></td>
            <td><div class="cell">${action}</div></td>
        </tr>
    `).join('');
}

function populateSelect(selectElement, values) {
    values.forEach(value => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectElement.appendChild(option);
    });
}

function getFilteredLogs(logs, user, date) {
    return logs.filter(log =>
        (user === "All" || log.user === user) &&
        (date === "All" || log.date === date)
    );
}

function sortLogs(logs, direction) {
    return logs.slice().sort((a, b) => {
        const aTime = `${a.date} ${a.time}`;
        const bTime = `${b.date} ${b.time}`;
        return direction === "asc"
            ? aTime.localeCompare(bTime)
            : bTime.localeCompare(aTime);
    });
}

function initializeLogInterface(data) {
    const infoLines = data.split('\n')
        .filter(line => line.includes("INFO") && !line.includes("ERROR"));

    const parsedLogs = infoLines.map(line => {
        const match = line.match(/^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}),\d+ - INFO - \[user: (.*?)] - (.*)$/);
        if (!match) return null;
        const [, date, time, user, action] = match;
        return {date, time, user, action};
    }).filter(entry => entry !== null);

    const userFilter = document.getElementById("filter-user");
    const dateFilter = document.getElementById("filter-date");
    const sortSelect = document.getElementById("sort-log");

    populateSelect(userFilter, [...new Set(parsedLogs.map(log => log.user))]);
    populateSelect(dateFilter, [...new Set(parsedLogs.map(log => log.date))]);

    function applyFilters() {
        const selectedUser = userFilter.value;
        const selectedDate = dateFilter.value;
        const sortDirection = sortSelect.value;

        const filtered = getFilteredLogs(parsedLogs, selectedUser, selectedDate);
        const sorted = sortLogs(filtered, sortDirection);
        renderLogs(sorted);
    }

    userFilter.addEventListener("change", applyFilters);
    dateFilter.addEventListener("change", applyFilters);
    sortSelect.addEventListener("change", applyFilters);
    applyFilters();
}

fetch("/get_log_file")
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load the file: " + response.status);
        }
        return response.text();
    })
    .then(initializeLogInterface)
    .catch(error => {
        console.error("Error fetching the file:", error);
    });
