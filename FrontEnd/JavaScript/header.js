// Función para cargar el header
async function loadHeader() {
    try {
        const response = await fetch('/DropHive/FrontEnd/html/header.html'); // Ruta absoluta
        if (!response.ok) {
            throw new Error(`Error al cargar el header: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById('header-container').innerHTML = html;

        // 🔹 Cargar el CSS dinámicamente después de cargar el header
        loadCSS('/DropHive/FrontEnd/css/header.css');

    } catch (error) {
        console.error('Error cargando el header:', error);
    }
}

// Función para cargar el CSS dinámicamente
function loadCSS(cssPath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath + '?v=' + new Date().getTime(); // 🔥 Evita el caché del navegador
    document.head.appendChild(link);
    console.log(`✅ CSS cargado: ${cssPath}`);
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", loadHeader);
