import { recuperarNombreBaseDatos } from "./recursos.js";

// Caricamento dati per modifica
document.addEventListener('DOMContentLoaded', async function () {
    const editId = localStorage.getItem('editCategoryId');

    if (editId) {
        try {
            const response = await fetch(`/get_category?id=${editId}`);
            if (!response.ok) throw new Error('Categoria non trovata');

            const data = await response.json();
            document.getElementById('category-id').value = data.id;
            document.getElementById('category-name').value = data.name;
            document.getElementById('category-description').value = data.description;

            if (data.image_url) {
                const previewImage = document.getElementById('preview-image');
                if (previewImage) previewImage.src = data.image_url;
            }

            localStorage.removeItem('editCategoryId');
            localStorage.removeItem('editCategoryName');
            localStorage.removeItem('editCategoryDescription');
        } catch (error) {
            console.error("Errore nel recupero della categoria:", error);
            alert("Impossibile caricare i dati della categoria.");
        }
    }

    const btn = document.getElementById("save-btn1");
    if (btn) {
        btn.addEventListener("click", agregarCategoria);
    } else {
        console.warn("Bottone non trovato");
    }
});

export const agregarCategoria = async () => {
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    if (!name || !description) {
        alert("Nome e descrizione sono obbligatori");
        return;
    }

    try {
        const db_name = await recuperarNombreBaseDatos();
        console.log("Base de datos:", db_name);

        const payload = {
            id: categoryId,
            name,
            description
        };

        const url = categoryId ? '/modify_category' : '/add_category';
        const method = categoryId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("Categoria salvata con successo!");
            window.location.href = '/home';
        } else {
            const errorMessage = await response.text();
            console.error("Errore dal server:", errorMessage);
            alert(`Errore: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Errore nella richiesta:", error);
        alert("Errore inatteso, vedi la console.");
    }
};
