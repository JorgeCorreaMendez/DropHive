// Función asincrónica que se ejecuta cuando el DOM está listo
async function initPagination(paginasTotales) {
  let currentPage = 1;
  const totalPages = paginasTotales; // Esto debería ser dinámico según la respuesta de la API
  const pageNumberElement = document.getElementById('page-number');
  const prevButton = document.getElementById('prev-button');
  const nextButton = document.getElementById('next-button');

  // Simula la llamada a la API para obtener los datos
  await fetchInventoryData();

  // Función para hacer la llamada a la API
  async function fetchInventoryData() {
    try {
      const response = await fetch('https://api.example.com/inventory'); // Cambia esta URL por la real
      const data = await response.json();

      // Aquí procesas los datos obtenidos de la API
      console.log(data); // Solo para ver la respuesta en consola

      // Suponiendo que la respuesta tenga un campo `totalItems` que te indica el total de artículos
      const totalItems = data.totalItems || 100; // Cambia según la estructura de tu API
      totalPages = Math.ceil(totalItems / 10); // Suponiendo que tienes 10 artículos por página

      console.log(`Total de páginas: ${totalPages}`);
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }

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

  // Inicializar la página
  updatePage();
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

    } catch (error) {
        console.error('Hubo un error al hacer la solicitud:', error);
    }
}

// Llamamos a la función cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', async () => {
  recuperarProductos().then();
  await initPagination(5); // Ejecuta la paginación después de obtener los datos de la API
});
