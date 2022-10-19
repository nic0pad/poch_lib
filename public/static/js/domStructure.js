import { createModalBox } from './modal.js'
import { searchBooks } from './book.js'

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

// Effacer les résultats de la recherche
function cleanResultSearch () {
  document.getElementById('search-result').hidden = true
  const searchDiv = document.getElementById('search-result-books')
  searchDiv.classList.add('withresult')
  searchDiv.innerHTML = ''
  return searchDiv
}

export { initDomStructure, displayErrors, cleanErrors, cleanResultSearch }
