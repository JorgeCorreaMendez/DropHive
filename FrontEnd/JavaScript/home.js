// Función asincrónica que se ejecuta cuando el DOM está listo

/*TODO:
  Hay que revisar que los productos se actualicen bien cuando hay un gran número de elementos.
  Hay que actualizar el recuperarProductos para que muestre el número de productos según se dice en el selector.
 */
async function initPagination(total_productos) {
    // Número total de artículos (esto debería ser el resultado de tu llamada a la API)
    const totalItems = total_productos; // Ejemplo: 100 artículos

    // Obtener el valor seleccionado en el select
    const itemsPerPageSelect = document.getElementById('items-per-page');
    let itemsPerPage = parseInt(itemsPerPageSelect.value, 10); // Obtener el valor seleccionado

    // Calcular el número de páginas
    let totalPages = Math.ceil(totalItems / itemsPerPage);

    // Mostrar el número total de páginas (puedes hacer algo con esto más tarde)
    console.log(`Total de páginas: ${totalPages}`);

    // Inicializar la paginación con las páginas correctas
    let currentPage = 1; // Página actual

    // Elementos de la paginación
    const pageNumberElement = document.getElementById('page-number');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // Mostrar la página inicial
    updatePage();

    // Función para actualizar la página mostrada
    function updatePage() {
        pageNumberElement.textContent = currentPage;

        // Deshabilitar botones si estamos en la primera o última página
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // Botón de la página anterior
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
        }
    });

    // Botón de la página siguiente
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
        }
    });

    // Cuando cambie el valor del select, recalcular y actualizar la paginación
    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
        totalPages = Math.ceil(totalItems / itemsPerPage); // Recálculo de páginas
        currentPage = 1; // Resetear a la primera página
        updatePage();
    });
}

async function recuperarProductos() {
  const pathname = window.location.pathname;
  const segments = pathname.split('/');
  const db_name = segments[1];
  console.log(db_name);

  try {
        const response = await fetch(`http://127.0.0.1:4000/${db_name}/products`);

        // Verifica que la respuesta sea exitosa
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        // Espera la respuesta JSON
        const data = await response.json();

        // Aquí puedes trabajar con los datos obtenidos de la API
        console.log(data);

        const tableBody = document.getElementById("table-body");

        data.forEach(item => {
          const row = document.createElement('tr');
          row.classList.add('bg-[#D9D9D9]', 'gap-[5px]', 'text-center');

          // A partir de aquí se muestran los elementos de las columnas
          const idCell = document.createElement('td');
          idCell.classList.add('p-2', 'rounded-[5px]');
          idCell.textContent = item.product_id;

          const nameCell = document.createElement('td');
          nameCell.classList.add('p-2', 'rounded-[5px]');
          nameCell.textContent = item.name;

          const categoryCell = document.createElement('td');
          categoryCell.classList.add('p-2', 'rounded-[5px]');
          categoryCell.textContent = item.category_id;

          const purchaseCell = document.createElement('td');
          purchaseCell.classList.add('p-2', 'rounded-[5px]');
          purchaseCell.textContent = item.price;

          const sellCell = document.createElement('td');
          sellCell.classList.add('p-2', 'rounded-[5px]');
          sellCell.textContent = item.price;

          const quantityCell = document.createElement('td');
          quantityCell.classList.add('p-2', 'rounded-[5px]');
          quantityCell.textContent = item.quantity;

          //Agregamos las celdas a la fila
          row.appendChild(idCell);
          row.appendChild(nameCell);
          row.appendChild(categoryCell);
          row.appendChild(purchaseCell);
          row.appendChild(sellCell);
          row.appendChild(quantityCell);

          //Agregamos al tablebody
          tableBody.appendChild(row);
        })

        return data.length

    } catch (error) {
        console.error('Hubo un error al hacer la solicitud:', error);
    }
}

// Llamamos a la función cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
  let total_productos = recuperarProductos().then();
  await initPagination(total_productos); // Ejecuta la paginación después de obtener los datos de la API
});
