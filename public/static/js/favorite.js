import { displayModalBox } from './modal.js'
import { displayBook, resultBooks } from './book.js'

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

export { addFavoriteBook, deleteFavoriteBook, displayFavoriteBooks }
