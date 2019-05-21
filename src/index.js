//Variables
const quoteList = document.getElementById("quote-list");
const quoteForm = document.getElementById("new-quote-form");
const newQuoteInput = document.getElementById("new-quote");
const newAuthorInput = document.getElementById("author");



///////// All BOOK DATA //////////

//Fetch all quotes
function fetchBooks() {
  fetch("http://localhost:3000/quotes")
    .then(res => res.json())
    .then(books => createQuoteList(books))
}

//Sets quoteList innerHTML equal to collection of quotes <li>s
function createQuoteList(books) {
  let bookString = "";
  books.forEach( book => bookString += createQuote(book) );
  quoteList.innerHTML = bookString;
}

//Creates quote <li> and child elements
function createQuote(book) {
  let quoteLi = `
    <li class='quote-card' data-id="${book.id}" data-likes="${book.likes}">
      <blockquote class="blockquote">
        <p class="mb-0">${book.quote}</p>
        <footer class="blockquote-footer">${book.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${book.likes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
  `
  return quoteLi;
}



///////// SUBMIT NEW QUOTE //////////

//Calls on submit quote if all form fields contain a value, provides red border indication on form fields with no value
function newQuote() {
  event.preventDefault();
  if (newQuoteInput.value && newAuthorInput.value) {
    newQuoteInput.style.borderColor = "";
    newAuthorInput.style.borderColor = "";
    submitQuote();
    event.target.reset()
  } else {
    !newQuoteInput.value ? newQuoteInput.style.borderColor = "red" : newQuoteInput.style.borderColor = "";
    !newAuthorInput.value ? newAuthorInput.style.borderColor = "red" : newAuthorInput.style.borderColor = "";
  }
}

//Fetch call that posts new quote
function submitQuote() {
  fetch("http://localhost:3000/quotes", quoteObj())
    .then( res => res.json() )
    .then( books => fetchBooks() )
}

//Returns quote object for fetch call in submitQuote()
function quoteObj() {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      author: newAuthorInput.value,
      quote: newQuoteInput.value,
      likes: 0
    })
  }
}



///////// LIKE QUOTE //////////

//Manages bubbling for quoteList event listener
function likeQuoteHandler() {
  let clicked = event.target;
  let id = clicked.parentElement.parentElement.dataset.id;
  let likes = clicked.parentElement.parentElement.dataset.likes;
  if (clicked.className === "btn-success") {
    likeQuote(id, likes);
  }
}

//Fetch call that patches quote with +1 like
function likeQuote(id, likes) {
  fetch(`http://localhost:3000/quotes/${id}`, likeQuoteObj(likes))
    .then( res => res.json() )
    .then( books => fetchBooks() )
}

//Returns quote object for fetch call in likeQuote()
function likeQuoteObj(likes) {
  likes = parseInt(likes);
  return {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ likes: likes + 1 })
  }
}



///////// DELETE QUOTE //////////

//Manages bubbling for quoteList event listener
function deleteQuoteHandler() {
  let clicked = event.target;
  let id = clicked.parentElement.parentElement.dataset.id;
  let likes = clicked.parentElement.parentElement.dataset.likes;
  if (clicked.className === "btn-danger") {
    deleteQuote(id);
  }
}

//Fetch call that deletes quote
function deleteQuote(id) {
  fetch(`http://localhost:3000/quotes/${id}`, deleteQuoteObj())
    .then( res => res.json() )
    .then( books => fetchBooks() )
}

//Returns quote object for fetch call in likeQuote()
function deleteQuoteObj() {
  return {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
}



///////// EVENT LISTENERS //////////
quoteForm.addEventListener("submit", newQuote)
quoteList.addEventListener("click", likeQuoteHandler)
quoteList.addEventListener("click", deleteQuoteHandler)



///////// INVOKED FUNCTIONS //////////
fetchBooks();
