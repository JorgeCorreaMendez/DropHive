// addAndModifyCategory.js

import { recuperarNombreBaseDatos } from "./recursos.js";

// --- 1. Caricamento dati e immagine (modifica categoria) ---
document.addEventListener('DOMContentLoaded', async function() {
    const editId = localStorage.getItem('editCategoryId');

    if (editId) {
        try {
            const response = await fetch(`/get_category?id=${editId}`);
            if (!response.ok) {
                throw new Error('Categoria non trovata');
            }
            const data = await response.json();

            document.getElementById('category-id').value = data.id;
            document.getElementById('category-name').value = data.name;
            document.getElementById('category-description').value = data.description;

            if (data.image_url) {
                const previewImage = document.getElementById('preview-image');
                if (previewImage) {
                    previewImage.src = data.image_url;
                }
            }

            // Pulizia del localStorage
            localStorage.removeItem('editCategoryId');
            localStorage.removeItem('editCategoryName');
            localStorage.removeItem('editCategoryDescription');

        } catch (error) {
            console.error("Errore nel recupero della categoria:", error);
            alert("Impossibile caricare i dati della categoria.");
        }
    }
});

// --- 2. Funzione per aggiungere o modificare categoria ---
export const agregarCategoria = async () => {
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    const imageInput = document.getElementById('image-input');
    const imageFile = imageInput.files[0];

    try {
        const db_name = await recuperarNombreBaseDatos();
        console.log("Base de datos:", db_name);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        if (categoryId) {
            formData.append('id', categoryId);  // Per aggiornare invece che creare
        }

        const response = await fetch('/add_category', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log("Categoria aggiunta/modificata correttamente!");
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
}
