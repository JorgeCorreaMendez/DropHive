export async function actualizarOpcionesCompanias() {
    const select = document.getElementById("select-company");

    if (!select) {
        return;
    }

    try {
        const response = await fetch('/companies');
        const data = await response.json();

        select.innerHTML = '<option value="" disabled selected>Selecciona una compañía</option>';
        data.forEach(company => {
            const option = new Option(company.name, company.id);
            select.add(option);
        });

    } catch (error) {
        console.error("Error al cargar compañías:", error);
    }
}
