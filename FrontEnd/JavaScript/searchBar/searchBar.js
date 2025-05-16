export async function busquedaAPI() {
    const resultsBox = document.getElementById("search-results");

    const query = this.value.trim();
    if(query.length === 0) {
        resultsBox.classList.add("hidden");
        resultsBox.innerHTML = "";
        return;
    }

    try {
        const res = await fetch(`/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        resultsBox.innerHTML = '';

        if(Object.values(data).every(arr => arr.length === 0)) {
            resultsBox.innerHTML = "<p class='text-gray-500'>No se encontraron resultados.</p>";
        } else {
            for ( const [tipo, items] of Object.entries(data)) {
                if(items.length > 0) {
                    const tipoTitulo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
                    const section = document.createElement("div");
                    section.innerHTML = `
                        <strong class="block text-gray-700 border-b border-gray-300 mb-1">${tipoTitulo}</strong>
                        <ul class="mb-2">
                            ${items.map(item => `<li class="text-sm hover:bg-gray-100 cursor-pointer px-2 py-1 rounded" data-id="${item.id}" data-tipo="${tipo}">${item.name}</li>`).join("")}
                        </ul>`;
                    resultsBox.appendChild(section);
                }
            }
        }
        resultsBox.classList.remove("hidden");
        resultsBox.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", () => {
                const tipo = li.getAttribute("data-tipo");
                const id = li.getAttribute("data-id");

                if(tipo === "products") {
                    mostrarReadArticulo(id);
                } else if (tipo === "categories") {
                    mostrarReadCategory(id);
                } else if (tipo === "companies") {
                    mostrarReadCompany(id);
                }
                else {
                    console.log(tipo);
                }
            });
        });
    } catch (e) {
        console.error("Error en la búsqueda:", e);
    }
}