import { localizarCategoria } from "../../home/productos.js";
import { openModal } from "../abrirYCerrarModal.js";
import { modificarArticulo } from "./modificarProducto.js";
import { eliminarArticulo } from "./eliminarArticulo.js";

export async function cargarDatosArticulo(datos_articulo) {
    const id = document.getElementById("id");
    const product_name = document.getElementById("product-name");
    const img = document.getElementById("imagen");
    const main_category = document.getElementById("main-category");
    const secondary_categories = document.getElementById("secondary-categories");
    const price = document.getElementById("price");
    const descripcion = document.getElementById("descripcion");
    const tabla_tallas = document.getElementById("table-body-producto");
    const tabla_productos_similares = document.getElementById("tabla-productos-similares");
    const company = document.getElementById("company");
    const companyWrapper = company?.closest("div"); // div contenedor con fondo amarillo

    tabla_tallas.innerHTML = '';
    tabla_productos_similares.innerHTML = '';

    // Validación mínima
    if (!product_name || !img) {
        console.error("Some element was not found.");
        return;
    }

    // Carga de datos
    id.textContent = datos_articulo.id;
    product_name.textContent = datos_articulo.name;
    img.alt = `image of ${datos_articulo.name}`;
    // img.src = datos_articulo.imagen; // Descomenta si se usa la imagen del servidor

    main_category.textContent = await localizarCategoria(datos_articulo.category_id);

    secondary_categories.innerHTML = '';
    datos_articulo.secondary_categories.forEach((category) => {
        const categoryElement = document.createElement('p');
        categoryElement.classList.add('text-sm', 'font-medium', 'text-green-800');
        categoryElement.textContent = category.name;
        secondary_categories.appendChild(categoryElement);
    });

    price.textContent = datos_articulo.price;
    descripcion.textContent = datos_articulo.description;

    // Mostrar compañía si existe
    if (company && datos_articulo.company?.name) {
    company.textContent = datos_articulo.company.name;
    companyWrapper?.classList.remove("hidden");
    } else {
        companyWrapper?.classList.add("hidden");
    }

    // Tabla de tallas
    datos_articulo.size.forEach(size => {
        const fila = document.createElement('tr');
        fila.className = 'text-center';
        fila.innerHTML = `
            <td>${size.name}</td>
            <td>${size.quantity}</td>
        `;
        tabla_tallas.appendChild(fila);
    });

    // Productos similares
    const response_similares = await fetch(`http://127.0.0.1:4000/similar_products?id=${datos_articulo.id}`);
    const productos_similares = await response_similares.json();

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
                console.error("Error loading modal:", err);
                Swal.fire({
                    icon: 'error',
                    title: "Error loading modal",
                    html: err.message || "An unexpected error occurred.",
                    timer: 2500,
                    showConfirmButton: false
                });
            }
        });
        tabla_productos_similares.appendChild(li);
    });
}
