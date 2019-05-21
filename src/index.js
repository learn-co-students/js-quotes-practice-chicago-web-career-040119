// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteList = document.getElementById("quote-list")
const newQuoteForm = document.getElementById("new-quote-form")
const newQuote = document.getElementById("new-quote")
const newAuthor = document.getElementById("author")
const submitButton = document.getElementsByClassName("btn btn-primary")
let allQuotes = []

newQuoteForm.addEventListener("submit", postQuote)

function loadQuotes() {
  fetch("http://localhost:3000/quotes")
    .then(resp => resp.json())
    .then(quotes => {
      allQuotes = quotes
      addDivToDom(allQuotes)
    })
}


function addDivToDom(array) {
  array.forEach(quote => {
    newQuoteList = addQuotesDataToDiv(quote)
    quoteList.appendChild(newQuoteList)
  })
}


function addQuotesDataToDiv(quote) {
  let li = document.createElement("li")
      li.className = "quote-card"

  let blockquote = document.createElement("blockquote")
      blockquote.className = "blockquote"

  let p  = document.createElement("p")
      p.className = "mb-0"

  let footer = document.createElement("footer")
      footer.className = "blockquote-footer"


  let br = document.createElement("br")

  let likesBtn = document.createElement("button")
      likesBtn.className = "btn-success"
      likesBtn.addEventListener("click", event => likeQuote(quote, event))


  let span = document.createElement("SPAN")

  let deleteBtn = document.createElement("button")
      deleteBtn.className = "btn-danger"
      deleteBtn.addEventListener("click", event => deleteQuote(quote, event))

  let editBtn = document.createElement("button")
      editBtn.className = "btn-edit"
      editBtn.addEventListener("click", event => editQuote(quote, event))

  p.innerHTML = quote.quote;
  footer.innerHTML = quote.author;
  likesBtn.innerHTML = "Likes: ";
  deleteBtn.innerHTML = "Delete";
  editBtn.innerHTML = "Edit"
  span.innerHTML = quote.likes;

  likesBtn.appendChild(span)
  blockquote.append(p, footer, br, likesBtn, deleteBtn, editBtn);
  li.appendChild(blockquote);

  return li
}

function postQuote() {
  event.preventDefault()
  console.log(event)
  let quote = event.target.querySelector("#new-quote").value;
  let author = event.target.querySelector("#author").value;

  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify ({
      quote: quote,
      author: author,
      likes: 0
    })
  })
  .then(resp => resp.json())
  .then(quotesData => {
    allQuotes.push(quotesData)
    quoteList.innerHTML = ""
    addDivToDom(allQuotes)
  })
  event.target.reset()
}

function likeQuote(quote, event) {
  event.preventDefault();
  let quoteId = quote.id;
  let likes = quote.likes;

  fetch("http://localhost:3000/quotes/" + quoteId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: likes + 1
    })
  })
  .then(resp => {
    // console.log(resp)
    quote.likes = likes + 1;
    event.target.querySelector("span").innerHTML = likes + 1 ;
    // event.tarhe
  })

}

function deleteQuote(quote, event) {
  fetch("http://localhost:3000/quotes/" + quote.id, {
    method: "DELETE"
  })
  event.target.parentElement.parentElement.remove()
}


function editQuotes(quote, event) {

}


loadQuotes();
