document.addEventListener("DOMContentLoaded", function () {
    console.log("Script cargado correctamente");

    const pageMap = {
        "supplier-btn": "../html/supply.html",
        "notification-btn": "../html/notifications.html",
        "add-item-btn": "../html/CreateItem.html",
        "add-company-btn": "../html/AddAndModifyCompany.html",
        "show-category-btn": "../html/addAndModifyCategory.html",
        "history-btn": "../html/log.html",
        "register-btn": "../html/register.html",
        "read-btn": "../html/Read_Article.html",
        "save-btn1": "../html/readCompany.html",
        "save-btn2": "../html/categoryPage.html",
        "add-btn": "../html/AddAndModifyCategory.html",
        "modify-btn": "../html/AddAndModifyCategory.html",
        "save-btn3": "../html/profile.html",
        "default-btn": "../html/modifyAccount.html",


    };

    Object.keys(pageMap).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            console.log(`Botón encontrado: ${id}`);
            button.addEventListener("click", function () {
                console.log(`Redirigiendo a: ${pageMap[id]}`);
                window.location.href = pageMap[id]; // Cambia de página
            });
        } else {
            console.warn(`Botón no encontrado: ${id}`);
        }
    });
})
