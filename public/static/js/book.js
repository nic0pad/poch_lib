import { addFavoriteBook, deleteFavoriteBook } from './favorite.js'
import { displayErrors, cleanErrors, cleanResultSearch } from './domStructure.js'

// Variable qui stocke temporairement le résultat de la recherche
let resultBooks = null

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

export { searchBooks, displayBook, resultBooks }
