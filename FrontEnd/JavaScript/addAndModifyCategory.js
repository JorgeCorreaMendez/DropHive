
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
            localStorage.removeItem('editCategoryId');
            localStorage.removeItem('editCategoryName');
            localStorage.removeItem('editCategoryDescription');
        } catch (error) {
            console.error("Errore nel recupero della categoria:", error);
            alert("Impossibile caricare i dati della categoria.");
        }
    }

    const saveButton = document.getElementById("save-btn1");
    if (saveButton) {
        saveButton.addEventListener("click", agregarCategoria);
    } else {
        console.warn("Bottone non trovato");
    }
});

export const agregarCategoria = async () => {
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;

    if (!name) {
        alert("El mombre es obligatorio");
        return;
    }

    try {
        const payload = {
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
