function createModalBox(element) {
    // Ajout d'une modal box
    let modal = document.createElement("div");
    modal.id = "messageModal";
    modal.className = "modal";

    let modalContent = document.createElement("div");
    modalContent.className = "modal__content";

    let modalClose = document.createElement("span");
    modalClose.className = "modal__content__close";
    modalClose.innerHTML= "&times;";
    modalClose.addEventListener("click", function() {
        document.getElementById("messageModal").style.display = "none";
    });
    modalContent.appendChild(modalClose);

    let modalMessage = document.createElement("p");
    modalMessage.innerHTML = "&nbsp;";
    modalContent.appendChild(modalMessage);

    modal.appendChild(modalContent);

    element.appendChild(modal);
}

function displayModalBox(message) {
    let paragraph = document.querySelector("#messageModal .modal__content > p");
    paragraph.innerHTML = message;
    document.getElementById("messageModal").style.display = "block";
}