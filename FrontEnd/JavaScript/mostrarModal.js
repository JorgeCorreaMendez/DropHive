import { recuperarNombreBaseDatos } from "./recursos.js";
import {agregarProducto} from "./createItem.js";
import {localizarCategoria} from "./home.js";

document.addEventListener("DOMContentLoaded", () => {
  const modalContainer = document.getElementById("modal-container");
  const modalContent = document.getElementById("modal-content");

  const openModal = (htmlContent) => {
    // Insertar el contenido en el modal
    modalContent.innerHTML = `
      <button id="close-modal" class="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-black">&times;</button>
      ${htmlContent}
    `;

    // Mostrar el contenedor
    modalContainer.classList.remove("hidden");

    // Forzar reflow para activar transición
    void modalContent.offsetWidth;

    // Aplicar clases de entrada
    modalContent.classList.remove("scale-95", "opacity-0");
    modalContent.classList.add("scale-100", "opacity-100");

    // Botón de cerrar
    modalContent.querySelector("#close-modal").addEventListener("click", closeModal);
  };

  const closeModal = () => {
    // Aplicar animación de salida
    modalContent.classList.remove("scale-100", "opacity-100");
    modalContent.classList.add("scale-95", "opacity-0");

    // Ocultar el modal después de la animación
    setTimeout(() => {
      modalContainer.classList.add("hidden");
    }, 300);
  };

  // Cierre al hacer clic fuera del contenido del modal
  modalContainer.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      closeModal();
    }
  });

  // Evento de abrir modal
  document.getElementById("add-item-btn").addEventListener("click", async () => {
    try {
      const db_name = await recuperarNombreBaseDatos();

      const response = await fetch(`/${db_name}/createItem`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      await document.getElementById("save-changes-btn").addEventListener("click", agregarProducto);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });

  document.getElementById("add-company-btn").addEventListener("click", async () => {
    try {
      const db_name = await recuperarNombreBaseDatos();

      const response = await fetch(`/${db_name}/addAndModifyCompany`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });

  document.getElementById("notification-btn").addEventListener("click", async () => {
    try {
      const db_name = await recuperarNombreBaseDatos();

      const response = await fetch(`/${db_name}/notifications`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
    }
  });

  /*
  A partir de aquí se trata de mostrar los articulos.
   */
  const tableBody = document.getElementById("table-body");

  if (!tableBody) {
    console.error("No se encontró el tbody con ID table-body");
    return;
  }

  tableBody.addEventListener("click", async (event) => {
    const clickedRow = event.target.closest("tr[data-product-id]");
    if (!clickedRow) return; // Click fuera de un producto válido

    console.log("Ha pasado")

    const id_product = clickedRow.getAttribute("data-product-id");
    if (!id_product) return;

    try {
      const db_name = await recuperarNombreBaseDatos();

      let response = await fetch(`/${db_name}/search_product?id=${id_product}`);
      const object = await response.json();

      response = await fetch(`/${db_name}/readArticle`);
      const html = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body.innerHTML;

      openModal(bodyContent);
      await cargarDatosArticulo(object[0])
      await modificarArticulo(object[0]);
    } catch (err) {
      console.error("Error al cargar el modal:", err);
      Swal.fire({
        icon: 'error',
        title: "Error al cargar el modal",
        html: err.message || "Ocurrió un error inesperado.",
        timer: 2500,
        showConfirmButton: false
      });
    }
  });

  async function cargarDatosArticulo(datos_articulo) {
    const db_name = await recuperarNombreBaseDatos();

    const id = document.getElementById("id");
    const product_name = document.getElementById("product-name");
    const img = document.getElementById("imagen");
    const main_category = document.getElementById("main-category");
    const lista_categorias = document.getElementById("lista-categorias");
    const price = document.getElementById("price");
    const descripcion = document.getElementById("descripcion");

    if (!product_name || !img) {
      console.log("No se ha encontrado algún elemento.");
      return;
    }
    id.textContent = datos_articulo.product_id;

    product_name.textContent = datos_articulo.name;

    img.alt = `imagen de ${datos_articulo.name}`;
    //img.src = datos_articulo.imagen;

    let nombre_categoria = localizarCategoria(db_name, datos_articulo.category_id);
    main_category.textContent = await nombre_categoria;

    /*
    for(articulo in datos_articulo.lista_categorias) {
      nombre_categoria = localizarCategoria(db_name, articulo);
      A partir de aquí creamos los elementos que se insertan con HTML y TailWind.
    }
    */

    price.textContent = datos_articulo.price;

    descripcion.textContent = datos_articulo.description;
  }

  function modificarArticulo(datos_articulo) {
    document.getElementById("modify-btn").addEventListener("click", async () => {
      try {
        const db_name = await recuperarNombreBaseDatos();
        const response = await fetch(`/${db_name}/createItem`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const bodyContent = doc.body.innerHTML;
        openModal(bodyContent);

        // Esperamos a que el modal se cargue antes de acceder al input
        setTimeout(() => {
          const product_name = document.getElementById("product-name");
          const descripcion = document.getElementById("description");
          const product_id = document.getElementById("product-id");
          const price = document.getElementById("price");

          if (!product_name) {
            console.log("No se ha encontrado.");
            return;
          }

          product_name.value = datos_articulo.name;
          descripcion.textContent = datos_articulo.description;
          product_id.value = datos_articulo.product_id;
          price.value = datos_articulo.price;
        }, 50); // 50ms es suficiente para la mayoría de casos

        // También asegúrate de registrar el click del botón después de cargar el modal
        document.getElementById("save-changes-btn").addEventListener("click", agregarProducto);
      } catch (err) {
        console.error("Error al cargar el modal:", err);
      }
    });
  }

});