document.addEventListener("DOMContentLoaded", function () {
    const BOOKS_URL = "http://localhost:3000/books"
    let bookList = document.getElementById('list')
    bookList.addEventListener('click', (e) => fetchBook(e))
    let showDiv = document.getElementById('show-panel')
    let currentUser = { id: 1, username: "pouros" }

    function getBooks() {
        return fetch(BOOKS_URL)
            .then(res => res.json())
    }
    getBooks().then(books => books.forEach(book => renderBook(book)))

    function renderBook(book) {
        let li = document.createElement('li')
        li.id = book.id
        li.innerText = book.title
        bookList.append(li)
    }

    function fetchBook(e) {
        //console.log('render book info is connected')
        //console.log(e.target.id)
        let bookId = e.target.id
        fetch(`${BOOKS_URL}/${bookId}`)
            .then(res => res.json())
            .then(book => renderBookInfo(book))
    }

    function renderBookInfo(book) {
        //console.log(book)
        showDiv.innerHTML = ""
        let img = document.createElement('img')
        img.src = book.img_url
        let p = document.createElement('p')
        p.id = 'book-desc'
        p.innerText = book.description
        let userList = document.createElement('ul')
        userList.id = "user-list"
        book.users.forEach(user => userList.append(listUser(user)))
        let button = document.createElement('button')
        button.className = "like-btn"
        button.setAttribute("data-id", book.id)
        button.innerText = "Like"
        showDiv.append(img, p, userList, button)
        button.addEventListener("click", () => handleLikeBtn(book))
    }

    function listUser(user) {
       //console.log(user)
        let li = document.createElement('li')
        li.setAttribute('data-id', user.id)
        li.innerText = user.username
        return li
    }


    function handleLikeBtn(book) {
        console.log("connected")
        console.log(book.users)
        let bookId = book.id

        let bookUsers = []
        book.users.forEach(user => bookUsers.push(user))
        bookUsers.push(currentUser)
        patchBook(bookId, bookUsers)
    }

    function patchBook(bookId, bookUsers) {
        let configObj = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accepts": "application/json"
            },
            body: JSON.stringify({
                "users": bookUsers
            })
        }
        return fetch(`${BOOKS_URL}/${bookId}`, configObj)
        .then(res => res.json())
        .then(book => renderBookInfo(book))
    }
});
