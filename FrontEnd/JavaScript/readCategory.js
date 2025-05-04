// readCategory.js

const cargarCategorias = async () => {
    try {
        const response = await fetch(`/get_categories?${id}`);
        const categories = await response.json();

        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = "bg-white p-4 rounded shadow-md flex flex-col justify-between";

            card.innerHTML = `
                <div class="mb-4">
                    <h2 class="text-xl font-semibold">${category.name}</h2>
                    <p class="text-gray-600">${category.description}</p>
                </div>
                <div class="flex gap-2 justify-end">
                    <button onclick="modificaCategoria('${category.id}')" class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">
                        Modifica
                    </button>
                    <button onclick="eliminaCategoria('${category.id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                        Elimina
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

    } catch (err) {
        console.error('Errore nel caricare le categorie:', err);
    }
};

const eliminaCategoria = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
        const res = await fetch(`/delete_category/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            alert('Category successfully deleted.');
            cargarCategorias();
        } else {
            const errorText = await res.text();
            alert('Errore: ' + errorText);
        }
    } catch (err) {
        console.error('Errore nell\'eliminazione:', err);
    }
};

const modificaCategoria = (id) => {
    // Reindirizza alla pagina con id come parametro
    window.location.href = `/FrontEnd/addAndModifyCategory.html?id=${id}`;
    localStorage.setItem('editCategoryId', id);
    localStorage.setItem('editCategoryName', name);
    localStorage.setItem('editCategoryDescription', description);
};

document.addEventListener('DOMContentLoaded', cargarCategorias);
