document.addEventListener("DOMContentLoaded", function() {
    const modifyButton = document.getElementById("modify-button");
    const addButton = document.getElementById("add-button");

    if (modifyButton) {
        modifyButton.addEventListener("click", function() {
            window.location.href = "/FrontEnd/html/addAndModifyCategory.html";
        });
    }

    if (addButton) {
        addButton.addEventListener("click", function() {
            window.location.href = "/FrontEnd/html/addAndModifyCategory.html";
        });
    }

    /*
    const yourStore = document.getElementById("yourStore");
    if (yourStore) {
        yourStore.addEventListener("click", function() {
            window.location.href = "profile.html";
        });
    }
    */
});
