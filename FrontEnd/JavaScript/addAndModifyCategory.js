// addAndModifyCategory.js

import { recuperarNombreBaseDatos } from "./recursos.js";  // Se lo usi anche per categorie

// --- 1. Caricamento immagine su click ---
document.addEventListener('DOMContentLoaded', function() {
    const editId = localStorage.getItem('editCategoryId');
    const editName = localStorage.getItem('editCategoryName');
    const editDescription = localStorage.getItem('editCategoryDescription');

    if (editId && editName && editDescription) {
        document.getElementById('category-id').value = editId;
        document.getElementById('category-name').value = editName;
        document.getElementById('category-description').value = editDescription;

        localStorage.removeItem('editCategoryId');
        localStorage.removeItem('editCategoryName');
        localStorage.removeItem('editCategoryDescription');
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
            formData.append('id', categoryId);
        }

        const response = await fetch('/add_category', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log("Categoria aggiunta correttamente!");
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



