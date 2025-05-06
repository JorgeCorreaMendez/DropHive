import {localizarCategoria} from "../../home/productos.js";
import {openModal} from "../abrirYCerrarModal.js";
import {modificarArticulo} from "./modificarProducto.js";
import {eliminarArticulo} from "./eliminarArticulo.js";

export async function cargarDatosArticulo(datos_articulo) {

  const id = document.getElementById("id");
  const product_name = document.getElementById("product-name");
  const img = document.getElementById("imagen");
  const main_category = document.getElementById("main-category");
  const price = document.getElementById("price");
  const descripcion = document.getElementById("descripcion");
  const tabla_tallas = document.getElementById("table-body-producto");
  tabla_tallas.innerHTML = ''
  const tabla_productos_similares  = document.getElementById("tabla-productos-similares");
  tabla_productos_similares.innerHTML = ''
  const response_productos_similares = await fetch(`http://127.0.0.1:4000/similar_products/${datos_articulo.id}`)
  const productos_similares = await response_productos_similares.json();

  if (!product_name || !img) {
    console.log("No se ha encontrado algún elemento.");
    return;
  }

  id.textContent = datos_articulo.id;
  product_name.textContent = datos_articulo.name;
  img.alt = `imagen de ${datos_articulo.name}`;
  // img.src = datos_articulo.imagen;

  main_category.textContent = await localizarCategoria(datos_articulo.category_id);

  price.textContent = datos_articulo.price;
  descripcion.textContent = datos_articulo.description;

  datos_articulo.size.forEach(size => {
    console.log("Estoo", size);
    const fila = document.createElement('tr');
    fila.className = 'text-center';
    fila.innerHTML = `
      <td>${size.name}</td>
      <td>${size.quantity}</td>
    `;
    tabla_tallas.appendChild(fila);
  })

  productos_similares.forEach(producto => {
    const li = document.createElement('li');
    li.textContent = producto.name;
    li.id = `producto-${producto.id}`;
    li.className = 'bg-white rounded p-2 shadow cursor-pointer';

    li.addEventListener('click', async () => {
      try {
        let response = await fetch(`filter_product_by_id?id=${producto.id}`);
        const object = await response.json();

        response = await fetch(`readArticle`);
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const bodyContent = doc.body.innerHTML;

        openModal(bodyContent);
        await cargarDatosArticulo(object[0]);
        await modificarArticulo(object[0]);
        await eliminarArticulo();
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
    })
    tabla_productos_similares.appendChild(li);
  })
}