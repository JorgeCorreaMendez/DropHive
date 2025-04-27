// readCategory.js

// Funzione per caricare tutte le categorie
const cargarCategorias = async () => {
    try {
        const response = await fetch('/get_categories'); // Devi creare questa route nel backend
        const categories = await response.json();

        const container = document.getElementById('categories-container');
        container.innerHTML = '';

        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = "bg-white p-4 m-2 rounded shadow-md flex justify-between items-center";

            categoryCard.innerHTML = `
                <div>
                    <h2 class="font-bold">${category.name}</h2>
                    <p class="text-gray-600">${category.description}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="editarCategoria('${category.id}', '${category.name}', '${category.description}')" class="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                    <button onclick="eliminarCategoria('${category.id}')" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">Delete</button>
                </div>
            `;

            container.appendChild(categoryCard);
        });

    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
};

// Funzione per eliminare una categoria
const eliminarCategoria = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        try {
            const response = await fetch(`/delete_category/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Categoría eliminada correctamente.');
                cargarCategorias(); // Ricarica le categorie
            } else {
                const errorMessage = await response.text();
                alert(`Error al eliminar: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
        }
    }
};

// Funzione per modificare una categoria
const editarCategoria = (id, name, description) => {
    // Salvare dati in localStorage
    localStorage.setItem('editCategoryId', id);
    localStorage.setItem('editCategoryName', name);
    localStorage.setItem('editCategoryDescription', description);

    // Andare alla pagina di modifica
    window.location.href = '/FrontEnd/addAndModifyCategory.html';
};

// Quando la pagina è caricata
document.addEventListener('DOMContentLoaded', cargarCategorias);
