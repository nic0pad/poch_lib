
initDomStructure();

function initDomStructure() {
    let hr = document.querySelector("#myBooks > hr");
    let parentNode = hr.parentNode;

    let divSearch = document.createElement("div");
    divSearch.classList.add("search");

    // Ajout du bouton pour ouvrir le formulaire de recherche
    addButton(divSearch, "Ajouter un livre",  "button-add-book", displaySearchForm);

    // Ajout du formulaire de recherche
    let divSearchForm = document.createElement("div");
    divSearchForm.classList.add("search-form");
    divSearchForm.setAttribute("id", "search-form");
    divSearchForm.hidden = true;
    divSearch.appendChild(divSearchForm);

    // Ajout des champs de recherche Titre et Auteur
    addInputSearch(divSearchForm, "Titre du livre", "search-title");
    addInputSearch(divSearchForm, "Auteur", "search-author");

    // Ajout div message d'erreurs
    let divErrors = document.createElement("div");
    divErrors.classList.add("search-form__errors");
    divErrors.setAttribute("id", "search-errors");
    divErrors.hidden = true;
    divSearchForm.appendChild(divErrors);

    // Ajout des boutons Recherche et Annuler
    addButton(divSearchForm, "Rechercher", "button-search", searchBooks);
    addButton(divSearchForm, "Annuler", "button-cancel", hideSearchForm);

    // Ajout div pour les resultats
    let divSearchResult = document.createElement("div");
    divSearchResult.classList.add("search-result");
    divSearchResult.setAttribute("id", "search-result");
    divSearchResult.hidden = true;
    divSearch.appendChild(divSearchResult);

    let titleSearchResult = document.createElement("h2");
    titleSearchResult.classList.add("search-result__title");
    titleSearchResult.innerText = "Résultats de recherche";
    divSearchResult.appendChild(titleSearchResult);

    let booksSearchResult = document.createElement("div");
    booksSearchResult.classList.add("search-result__books");
    booksSearchResult.classList.add("grid");
    booksSearchResult.setAttribute("id", "search-result-books");
    divSearchResult.appendChild(booksSearchResult);

    parentNode.insertBefore(divSearch, hr);
}

// Function pour ajouter un champ input
function addInputSearch(parentElement, label, id) {
    let div = document.createElement("div");
    div.classList.add("search-form__element");

    let title = document.createElement("span");
    title.classList.add("search-form__element__title");
    title.innerText = label;
    div.appendChild(title);

    let inputSearch = document.createElement("input");
    inputSearch.classList.add("search-form__element__input");
    inputSearch.setAttribute("id", id);
    inputSearch.type = "search";
    div.appendChild(inputSearch);

    parentElement.appendChild(div);
}

// Fonction pour ajouter un bouton
function addButton(parentElement, label, id, eventListener) {
    let div = document.createElement("div");
    div.classList.add("search-form__button");

    let button = document.createElement("button");
    button.classList.add("button");
    button.classList.add(id);
    button.setAttribute("id", id);
    button.innerHTML = label;

    if (eventListener != null) {
        button.addEventListener("click", eventListener);
    }

    div.appendChild(button);

    parentElement.appendChild(div);
}

function displaySearchForm() {
    document.getElementById("search-form").hidden = false;
    document.getElementById("button-add-book").hidden = true;
}

function hideSearchForm() {
    document.getElementById("search-form").hidden = true;
    document.getElementById("button-add-book").hidden = false;

    //Vide le formulaire de recherche
    let inputs = document.getElementsByClassName("search-form__element__input");
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }

    //Vide les résultats de recherche
    cleanResultSearch();

    //Vide les erreurs
    cleanErrors();
}

async function searchBooks() {
    const title = document.getElementById("search-title").value;
    const author = document.getElementById("search-author").value;

    if (title == "" || author == "") {
        displayErrors("Renseignez le titre du livre ET l'auteur !");
    } else {
        cleanErrors();
        const response = await fetch("https://www.googleapis.com/books/v1/volumes?q=intitle:'" + title + "'+inauthor:'" + author + "'");
        const books = await response.json();

        //const books = await fetch("https://www.googleapis.com/books/v1/volumes?q=intitle:'" + title + "'+inauthor:'" + author + "'").then(books => books.json);

        displayResultSearch(books);
    }
}

function displayErrors(message) {
    const errorsDiv = document.getElementById("search-errors");
    errorsDiv.innerText = message;
    errorsDiv.hidden = false;
}

function cleanErrors() {
    const errorsDiv = document.getElementById("search-errors");
    errorsDiv.hidden = true;
    errorsDiv.innerText = "";
}

function displayResultSearch(books) {
    const searchDiv = cleanResultSearch();
    if (books.totalItems == 0) {
        searchDiv.classList.add("noresult");
        searchDiv.innerHTML = "Aucun livre n'a été trouvé";
    } else {
        for (let book of books.items) {
            searchDiv.appendChild(displayBook(book));
        }
    }
    document.getElementById("search-result").hidden = false;
}

function cleanResultSearch() {
    document.getElementById("search-result").hidden = true;
    const searchDiv = document.getElementById("search-result-books");
    searchDiv.classList.add("withresult");
    searchDiv.innerHTML = "";
    return searchDiv;
}

function displayBook(book) {
    let divBook = document.createElement("section");
    divBook.classList.add("book"); 
    
    let description = "Information manquante";
    if (typeof book.volumeInfo.description !== 'undefined') {
        description = book.volumeInfo.description;
        if (description.length > 200) {
            description = description.substring(0, 200) + '...';
        }
    }

    let thumbnail = getLocation() + "public/img/unavailable.png";
    if (typeof book.volumeInfo.imageLinks !== 'undefined' && typeof book.volumeInfo.imageLinks.thumbnail !== 'undefined') {
        thumbnail = book.volumeInfo.imageLinks.thumbnail;
    }

    let auteur = "";
    if (typeof book.volumeInfo.authors !== 'undefined') {
        auteur = book.volumeInfo.authors[0];
    }

    //divBook.appendChild(addIcon());
    let title = addElement("Titre : ", book.volumeInfo.title, "book__title");
    title.appendChild(addIcon());
    divBook.appendChild(title);
    //divBook.appendChild(addElement("Titre : ", book.volumeInfo.title, "book__title"));
    divBook.appendChild(addElement("Id : ", book.id, "book__id"));
    divBook.appendChild(addElement("Auteur : ", auteur, "book__author"));
    divBook.appendChild(addElement("Description : ", description, "book__description"));
    divBook.appendChild(addElementImage(thumbnail));

    return divBook;
}

function addElement(label, value, className) {
    let div = document.createElement("p");
    div.classList.add("book__info");
    div.classList.add(className);

    let spanLabel = document.createElement("span");
    spanLabel.classList.add("label");
    spanLabel.innerHTML = label;

    div.appendChild(spanLabel);

    let spanValue = document.createElement("span");
    spanValue.classList.add("value");
    spanValue.innerHTML = value;

    div.appendChild(spanValue);

    return div;
}

function addIcon() {
    let icon = document.createElement("i");
    icon.classList.add("fa-regular");
    icon.classList.add("fa-bookmark");
    icon.setAttribute("title", "Ajouter ce livre à votre posh'liste");
    return icon;
}

function addElementImage(value) {
    let div = document.createElement("div");
    div.classList.add("book__image");

    let thumbnail = document.createElement("img");
    thumbnail.setAttribute("src", value);

    div.appendChild(thumbnail);

    return div;
}

function getLocation() {
    const path = location.href;
    const index = path.lastIndexOf('index.html');
    return path.substring(0, index);
}