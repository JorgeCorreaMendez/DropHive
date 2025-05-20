import { recuperarNombreBaseDatos } from "../../recursos";
import { localizarCategoria } from "../../home/productos";
import { addProduct } from "../../createProduct";

const tableBody = document.getElementById("table-body");

if (!tableBody) {
  console.error("Could not find tbody with ID table-body");
  return;
}

tableBody.addEventListener("click", async (event) => {
  const clickedRow = event.target.closest("tr[data-product-id]");
  if (!clickedRow) return; // Click outside of a valid product

  const id_product = clickedRow.getAttribute("data-product-id");
  if (!id_product) return;

  try {
    const db_name = await recuperarNombreBaseDatos();

    let response = await fetch(`/${db_name}/filter_product_by_id?id=${id_product}`);
    const object = await response.json();

    response = await fetch(`/${db_name}/readArticle`);
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const bodyContent = doc.body.innerHTML;

    openModal(bodyContent);
    await cargarDatosArticulo(object[0]);
    await modificarArticulo(object[0]);
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
    console.alert("Some element was not found.");
    return;
  }

  id.textContent = datos_articulo.product_id;
  product_name.textContent = datos_articulo.name;
  img.alt = `Image of ${datos_articulo.name}`;
  // img.src = datos_articulo.imagen;

  let nombre_categoria = localizarCategoria(db_name, datos_articulo.category_id);
  main_category.textContent = await nombre_categoria;

  /*
  for (articulo in datos_articulo.lista_categorias) {
    nombre_categoria = localizarCategoria(db_name, articulo);
    From here we create the elements to be inserted using HTML and Tailwind.
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

      // Wait for the modal to load before accessing the input
      setTimeout(() => {
        const product_name = document.getElementById("product-name");
        const descripcion = document.getElementById("description");
        const product_id = document.getElementById("product-id");
        const price = document.getElementById("price");

        if (!product_name) {
          console.alert("Element not found.");
          return;
        }

        product_name.value = datos_articulo.name;
        descripcion.textContent = datos_articulo.description;
        product_id.value = datos_articulo.product_id;
        price.value = datos_articulo.price;
      }, 50); // 50ms is enough in most cases

      // Also make sure to register the button click after loading the modal
      document.getElementById("save-changes-btn").addEventListener("click", addProduct);
    } catch (err) {
      console.error("Error loading modal:", err);
    }
  });
}
