async function loadTemplate(templateName, targetElementId) {
    try {
        const response = await fetch(`http://127.0.0.1:4000/templates/${templateName}.html`); // Cambié la ruta
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading template ${templateName}:`, error);
    }
}


function loadDefaultTemplates() {
    loadTemplate("header", 'header-container');

}
function initializePage() {
    loadDefaultTemplates(); // Siempre cargamos el header y footer}
}

window.onload = function() {
    initializePage(); // Cargar header, footer y body específico según la página
};