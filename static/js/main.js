import { createModalBox, displayModalBox } from './modal.js'

// Initialisation de la structure de la page
initDomStructure()

// Affichage dans les favoris des livres qui sont dans le localStorage
displayFavoriteBooks()

// Variable qui stocke temporairement le résultat de la recherche
let resultBooks = null

// Construction du DOM
function initDomStructure () {
  const hr = document.querySelector('#myBooks > hr')
  const parentNode = hr.parentNode

  // Ajout div pour la recherche (formulaire + résultats)
  const divSearch = document.createElement('div')
  divSearch.className = 'search'

  // Ajout du bouton pour ouvrir le formulaire de recherche
  addButton(divSearch, 'Ajouter un livre', 'button-add-book', displaySearchForm)

  // Ajout du formulaire de recherche
  const divSearchForm = document.createElement('div')
  divSearchForm.className = 'search-form'
  divSearchForm.id = 'search-form'
  divSearchForm.hidden = true
  divSearch.appendChild(divSearchForm)

  // Ajout des champs de recherche Titre et Auteur
  addInputSearch(divSearchForm, 'Titre du livre', 'search-title')
  addInputSearch(divSearchForm, 'Auteur', 'search-author')

  // Ajout div message d'erreurs
  const divErrors = document.createElement('div')
  divErrors.className = 'search-form__errors'
  divErrors.id = 'search-errors'
  divErrors.hidden = true
  divSearchForm.appendChild(divErrors)

  // Ajout des boutons Recherche et Annuler
  addButton(divSearchForm, 'Rechercher', 'button-search', searchBooks)
  addButton(divSearchForm, 'Annuler', 'button-cancel', hideSearchForm)

  // Ajout div pour les resultats
  const divSearchResult = document.createElement('div')
  divSearchResult.className = 'search-result'
  divSearchResult.id = 'search-result'
  divSearchResult.hidden = true
  divSearch.appendChild(divSearchResult)

  // Ajout du titre et de la div pour les résultats de recherche
  const titleSearchResult = document.createElement('h2')
  titleSearchResult.className = 'search-result__title'
  titleSearchResult.innerText = 'Résultats de recherche'
  divSearchResult.appendChild(titleSearchResult)

  const booksSearchResult = document.createElement('div')
  booksSearchResult.className = 'search-result__books grid'
  booksSearchResult.id = 'search-result-books'
  divSearchResult.appendChild(booksSearchResult)

  parentNode.insertBefore(divSearch, hr)

  // Ajout de la div pour la liste des favoris
  const pochList = document.getElementById('content')
  const favoriteBooks = document.createElement('div')
  favoriteBooks.className = 'favorites grid'
  favoriteBooks.id = 'favorites'
  pochList.appendChild(favoriteBooks)

  // Creation de la modal box pour afficher des messages
  createModalBox(document.getElementById('myBooks'))
}

// Ajouter un champ input de recherche
function addInputSearch (parentElement, label, id) {
  const div = document.createElement('div')
  div.className = 'search-form__element'

  const title = document.createElement('span')
  title.className = 'search-form__element__title'
  title.innerText = label
  div.appendChild(title)

  const inputSearch = document.createElement('input')
  inputSearch.className = 'search-form__element__input'
  inputSearch.id = id
  inputSearch.type = 'search'
  div.appendChild(inputSearch)

  parentElement.appendChild(div)
}

// Ajouter un bouton
function addButton (parentElement, label, id, eventListener) {
  const div = document.createElement('div')
  div.className = 'search-form__button'

  const button = document.createElement('button')
  button.classList.add('button')
  button.classList.add(id)
  button.id = id
  button.innerHTML = label

  if (eventListener != null) {
    button.addEventListener('click', eventListener)
  }

  div.appendChild(button)

  parentElement.appendChild(div)
}

// Affiche le formulaire de recherche
function displaySearchForm () {
  document.getElementById('search-form').hidden = false
  document.getElementById('button-add-book').hidden = true
}

// Cache et vide le formulaire de recherche et les résultats
function hideSearchForm () {
  document.getElementById('search-form').hidden = true
  document.getElementById('button-add-book').hidden = false

  // Vide le formulaire de recherche
  const inputs = document.getElementsByClassName('search-form__element__input')
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = ''
  }

  // Vide les résultats de recherche
  cleanResultSearch()

  // Vide les erreurs
  cleanErrors()
}

// Rechercher les livres dans Google API et les afficher
async function searchBooks () {
  const title = document.getElementById('search-title').value
  const author = document.getElementById('search-author').value

  if (title === '' || author === '') {
    displayErrors('<i class="fa-solid fa-triangle-exclamation"></i> Renseignez le titre du livre ET l\'auteur !')
  } else {
    cleanErrors()
    const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=intitle:\'' + title + '\'+inauthor:\'' + author + '\'')
    const books = await response.json()
    displayResultSearch(books)
  }
}

// Afficher un message d'erreur
function displayErrors (message) {
  const errorsDiv = document.getElementById('search-errors')
  errorsDiv.innerHTML = message
  errorsDiv.hidden = false
}

// Effacer le message d'erreur
function cleanErrors () {
  const errorsDiv = document.getElementById('search-errors')
  errorsDiv.hidden = true
  errorsDiv.innerText = ''
}

// Afficher les livres dans la div de recherche
function displayResultSearch (books) {
  const searchDiv = cleanResultSearch()
  if (books.totalItems === 0) {
    searchDiv.className = 'noresult'
    searchDiv.innerHTML = 'Aucun livre n\'a été trouvé'
  } else {
    resultBooks = books.items
    for (const book of books.items) {
      searchDiv.appendChild(displayBook(book, 'search'))
    }
  }
  document.getElementById('search-result').hidden = false
}

// Effacer les résultats de la recherche
function cleanResultSearch () {
  document.getElementById('search-result').hidden = true
  const searchDiv = document.getElementById('search-result-books')
  searchDiv.classList.add('withresult')
  searchDiv.innerHTML = ''
  return searchDiv
}

// Afficher un livre
function displayBook (book, type) {
  const divBook = document.createElement('section')
  divBook.id = type + '_' + book.id
  divBook.className = 'book'

  let description = 'Information manquante'
  if (typeof book.volumeInfo.description !== 'undefined') {
    description = book.volumeInfo.description
    if (description.length > 200) {
      description = description.substring(0, 200) + '...'
    }
  }

  let thumbnail = '/static/img/unavailable.png'
  if (typeof book.volumeInfo.imageLinks !== 'undefined' && typeof book.volumeInfo.imageLinks.thumbnail !== 'undefined') {
    thumbnail = book.volumeInfo.imageLinks.thumbnail
  }

  let auteur = ''
  if (typeof book.volumeInfo.authors !== 'undefined') {
    auteur = book.volumeInfo.authors[0]
  }

  const title = addElement('Titre : ', book.volumeInfo.title, 'book__title')
  title.appendChild(addIcon(type, book.id))
  divBook.appendChild(title)
  divBook.appendChild(addElement('Id : ', book.id, 'book__id'))
  divBook.appendChild(addElement('Auteur : ', auteur, 'book__author'))
  divBook.appendChild(addElement('Description : ', description, 'book__description'))
  divBook.appendChild(addElementImage(thumbnail))

  return divBook
}

// Afficher un élément du livre
function addElement (label, value, className) {
  const div = document.createElement('p')
  div.className = 'book__info ' + className

  const spanLabel = document.createElement('span')
  spanLabel.className = 'label'
  spanLabel.innerHTML = label

  div.appendChild(spanLabel)

  const spanValue = document.createElement('span')
  spanValue.className = 'value'
  spanValue.innerHTML = value

  div.appendChild(spanValue)

  return div
}

// Afficher une icône
function addIcon (type, bookId) {
  const icon = document.createElement('i')

  switch (type) {
    case 'search':
      icon.className = 'fa-solid fa-bookmark'
      icon.title = 'Ajouter ce livre à votre posh\'liste'
      icon.addEventListener('click', function () {
        addFavoriteBook(bookId)
      })
      break
    case 'favorite':
      icon.className = 'fa-solid fa-trash'
      icon.title = 'Supprimer ce livre de votre posh\'liste'
      icon.addEventListener('click', function () {
        deleteFavoriteBook(bookId)
      })
      break
  }
  return icon
}

// Afficher l'image du livre
function addElementImage (value) {
  const div = document.createElement('div')
  div.className = 'book__image'

  const thumbnail = document.createElement('img')
  thumbnail.src = value

  div.appendChild(thumbnail)

  return div
}

// Ajoute un livre dans les favoris
function addFavoriteBook (bookId) {
  const book = resultBooks.find(book => book.id === bookId)

  const favorite = document.getElementById('favorite_' + book.id)
  if (favorite === null) {
    const favoriteDiv = document.getElementById('favorites')
    favoriteDiv.appendChild(displayBook(book, 'favorite'))
    saveBook(book)
    displayModalBox('<i class="fa-solid fa-circle-check"></i> Le livre a été ajouté à votre liste.')
  } else {
    displayModalBox('<i class="fa-solid fa-triangle-exclamation"></i> Vous ne pouvez ajouter deux fois le même livre <i class="fa-solid fa-triangle-exclamation"></i>')
  }
}

// Supprimer un livre des favoris
function deleteFavoriteBook (bookId) {
  const favorite = document.getElementById('favorite_' + bookId)
  favorite.remove()
  deleteBook(bookId)
  displayModalBox('<i class="fa-solid fa-circle-check"></i> Le livre a été supprimé de votre liste.')
}

// Retourne la liste des livres stockés dans le localStorage
function getBooks () {
  let books = window.localStorage.getItem('books')
  if (books === null) {
    books = []
  } else {
    books = JSON.parse(books)
  }
  return books
}

// Sauvegarde un livre dans le localStorage
function saveBook (book) {
  const books = getBooks()
  books.push(book)
  window.localStorage.setItem('books', JSON.stringify(books))
}

// Supprime un livre du localStorage
function deleteBook (bookId) {
  const books = getBooks()
  const index = books.findIndex(book => book.id === bookId)
  books.splice(index, 1)
  window.localStorage.setItem('books', JSON.stringify(books))
}

// Afficher les livres stockés dans le localStorage dans la div de favoris
function displayFavoriteBooks () {
  const favoriteDiv = document.getElementById('favorites')
  const books = getBooks()
  for (const book of books) {
    if (book !== null) {
      favoriteDiv.appendChild(displayBook(book, 'favorite'))
    }
  }
}
