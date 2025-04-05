document.addEventListener("DOMContentLoaded", () => {
    const dbName = window.location.pathname.split("/")[1];
    fetch(`/api/${dbName}/log`)
    .then(res => res.json())
    .then(data => {
    const tbody = document.getElementById("log-table-body");
    tbody.innerHTML = "";

    data.forEach(entry => {
    const row = document.createElement("tr");

    row.innerHTML = `
                        <td>${entry.compania}</td>
                        <td>${entry.item}</td>
                        <td>${entry.accion}</td>
                    `;

    tbody.appendChild(row);
});
})
    .catch(error => console.error("Error cargando log:", error));
});
