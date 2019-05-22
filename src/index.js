// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

const qForm = document.getElementById('new-quote-form')
let subButton = document.getElementById('sub-quote-button')
const quoteInput = document.getElementById('new-quote')
const authorInput = document.getElementById('author')
const quoteList = document.getElementById('quote-list')
subButton.addEventListener('click', function() {
  event.preventDefault()
  subQuote(event)
})

quoteList.addEventListener('click', function() {
  likePost(event)
  deleteQuotes(event)
})

/////////////////// Event Functions ///////////////////////////

function subQuote(event) {
  if (event.target === subButton) {
    console.log(quoteInput.value)
    console.log(authorInput.value)

    let quoteSubmitted = {
      quote: quoteInput.value,
      likes: 0,
      author: authorInput.value
    }
    postQuote(quoteSubmitted)
    qForm.reset()
  }
}

function likePost (event) {
  if (event.target.className === "btn-success") {
    console.log(event.target)
    let likeData = {}
    likeData.id = parseInt(event.target.parentElement.parentElement.dataset.qid)
    likeData.likes = parseInt(event.target.querySelector("span").textContent)
    console.log("this is my likeData object: ", likeData)

    patchLike(likeData)
  }
}

function deleteQuotes (event) {
  if (event.target.className === "btn-danger") {
    console.log("delete button clicked", event.target)
    let deleteID = parseInt(event.target.parentElement.parentElement.dataset.qid)
    deleteQuoteFetch(deleteID)
  }
}

/////////////////// Event Functions End ///////////////////////////

/////////////////// Fetch Functions ///////////////////////////
function postQuote (qSubmit) {
  fetch("http://localhost:3000/quotes", {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      quote: qSubmit.quote,
      author: qSubmit.author,
      likes: qSubmit.likes
    })
  })
  .then(resp => resp.json())
  // .then(data => console.log("this is what you got"))
  .then(data => quoteList.innerHTML += renderLi(data))
}

function patchLike(qLike) {
  fetch(`http://localhost:3000/quotes/${qLike.id}`, {
    method: "PATCH",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify ({
      likes: qLike.likes + 1
    })
  })
  .then(resp => resp.json())
  // .then(data => console.log("this is what you got"))
  .then(data => {
    console.log("like patch success", data)
    renderLikes(data)
  })
}

function deleteQuoteFetch (delID) {
  let deleteThis = delID
  fetch(`http://localhost:3000/quotes/${delID}`, {method: 'Delete'})
  .then(resp => resp.json())
  .then(data => {
    console.log("this is resp from serv for del", data)
    removeLi(deleteThis)
  })
}

function getQuotes() {
  fetch("http://localhost:3000/quotes")
  .then(resp => resp.json())
  .then(qData => {
    quoteList.innerHTML = renderQuotes(qData)
  })
}

/////////////////// Fetch Functions End ///////////////////////////

/////////////////// Render Functions ///////////////////////////
function renderLi(object) {
  return(
    `
    <li class='quote-card' data-qId=${object.id}>
      <blockquote class="blockquote">
        <p class="mb-0">${object.quote}</p>
        <footer class="blockquote-footer">-${object.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${object.likes}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>
    </li>
    <br>
    `
  )
}

function renderQuotes (object) {
  let quoteHTML = ``
  object.forEach((qObj) => {
    quoteHTML += renderLi(qObj)
  })
  return quoteHTML
}

function renderLikes (data) {
  likedLi = quoteList.querySelector(`.quote-card[data-qid='${data.id}']`)
  likedLi.querySelector("span").textContent = data.likes
}

function removeLi (id) {
  let removeLi = quoteList.querySelector(`.quote-card[data-qid='${id}']`)
  removeLi.parentNode.removeChild(removeLi)
}

/////////////////// Render Functions End ///////////////////////////

/////////////////// PageLoad Functions ///////////////////////////
getQuotes()
