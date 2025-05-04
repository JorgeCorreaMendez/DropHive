export async function actualizarOpcionesCategoria() {
    const select = document.getElementById('select-categoria');

    select.innerHTML = '<option value="all">All</option>';

    try {
        const response = await fetch(`http://127.0.0.1:4000/categories`);

        if(!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json()

        console.log(data);

        for (let i = 0; i < data.length; i++) {
            const option = document.createElement('option');
            option.value = data[i].name; // O cambia por otro campo si necesitas otro valor
            option.textContent = data[i].name;
            select.appendChild(option);
        }

    } catch (e) {
        console.log(e);
    }
}