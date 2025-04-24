export async function initPagination(totalProductos) {
    const itemsPerPageSelect = document.getElementById('items-per-page');
    const pageNumberElement = document.getElementById('page-number');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    let itemsPerPage = getItemsPerPage(itemsPerPageSelect);
    let totalPages = calculateTotalPages(totalProductos, itemsPerPage);
    let currentPage = 1;

    // Mostrar la primera página
    updatePage(currentPage, totalPages, pageNumberElement, prevButton, nextButton);

    // Listeners
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage(currentPage, totalPages, pageNumberElement, prevButton, nextButton);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage(currentPage, totalPages, pageNumberElement, prevButton, nextButton);
        }
    });

    // Escuchar cambios en el selector de ítems por página
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = getItemsPerPage(itemsPerPageSelect);
        totalPages = calculateTotalPages(totalProductos, itemsPerPage);
        currentPage = 1;
        updatePage(currentPage, totalPages, pageNumberElement, prevButton, nextButton);
    });
}

// Función para obtener cuántos ítems por página se han seleccionado
function getItemsPerPage(selectElement) {
    return parseInt(selectElement.value, 10);
}

// Función para calcular el número total de páginas
function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}

// Función para actualizar la interfaz según la página actual
function updatePage(currentPage, totalPages, pageElement, prevBtn, nextBtn) {
    pageElement.textContent = currentPage;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    console.log(`Página actual: ${currentPage} de ${totalPages}`);
}
