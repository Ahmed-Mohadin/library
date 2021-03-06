// Class book, with constructor
class Book {
    constructor(title = 'Unknown', author = 'Unknown', pages = 0, isRead = false){
        this.id = Date.now();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}

// Class library, with constructor and functions
class Library {
    constructor(){
        this.collection = [];
        this.isDark = false;
    }

    addBook(newBook){
        this.collection.push(newBook);
    }

    isInCollection(newBook){
        return this.collection.some((book) => book.title == newBook.title);
    }

    removeBook(id){
        this.collection = this.collection.filter((book) => book.id != id)
    }

    getBook(id){
        return this.collection.find((book) => book.id == id);
    }
    
    saveLocal(){
        const data = [this.collection, this.isDark];
        const myData = JSON.stringify(data);
        localStorage.setItem("myData", myData);
    }
    
    restoreLocal(){                
        const myData = JSON.parse(localStorage.getItem('myData'));
        if(myData){
            this.collection = myData[0];
            this.isDark = myData[1];    
        }
    }
}

// Get all necessary DOM nodes
const sunMode = document.querySelector('.sun-mode');
const btnAdd = document.querySelector('.btn-add');
const grid = document.querySelector('.grid');
const gridBook = document.querySelectorAll('.grid-book');

const bookForm = document.querySelector('.book-form');
const header = document.querySelector('header');
const body = document.querySelector('body');
const aside = document.querySelector('aside');

// Declare necessary variables
const library = new Library();

// Restore localStorage
library.restoreLocal();
library.isDark ? darkMode(header, body) : lightMode(header, body);

// Handle wether the user wants dark/lightmode
sunMode.addEventListener('click', handleMode);
    
function handleMode(){
    library.saveLocal();
    library.isDark ? lightMode(header, body) : darkMode(header, body);
    showBooks();
}

function darkMode(header, body){
    header.style.backgroundColor = '#333333';
    header.style.color = '#FFF';
    body.style.backgroundColor = '#7F7F7F';
    gridBook.forEach((div) => {
        div.style.backgroundColor = '#333333';
        div.style.color = '#FFF'
    });
    bookForm.style.backgroundColor = '#333333';
    bookForm.style.color = '#FFF';
    library.isDark = true;
}

function lightMode(header, body){
    body.style.backgroundColor = '#F0EEF1';
    header.style.backgroundColor = '#FFFBFB';
    header.style.color = '#000';
    gridBook.forEach((div) => {
        div.style.backgroundColor = '#FFFBFB';
        div.style.color = '#000'
    });
    bookForm.style.backgroundColor = '#FFFBFB';
    bookForm.style.color = '#000';
    library.isDark = false;
}

// Check wether the user clicked btnAdd or inside/outside the form
window.addEventListener('click', (e) => {
    if(btnAdd.contains(e.target) || bookForm.contains(e.target)) openForm();
    else if(document.querySelector('body').contains(e.target)) closeForm();
})

function openForm(){
    aside.classList.remove('not-active');
    aside.classList.add('overlay');
}

function closeForm(){
    aside.classList.add('not-active');
    aside.classList.remove('overlay');
}

// Capitalize first letter of any string
function capitalize(name){
    return name.toLowerCase()
               .split(' ')
               .map((w) => w.charAt(0).toUpperCase() + w.substring(1))
               .join(' ');
}

// Handle the form values
bookForm.addEventListener('submit', handleSubmit);

function handleSubmit(e){
    e.preventDefault();
    
    const title = e.target[0].value;
    const author = e.target[1].value;
    const pages = e.target[2].value;
    const status = e.target[3].checked;

    const newBook = new Book(capitalize(title), capitalize(author), pages, status);
    const errMsg = document.querySelector('.err-msg');
    if(library.isInCollection(newBook)){
        errMsg.innerText = 'This book already exists in your library';
        errMsg.classList.remove('not-active');
    }    
    else{
        errMsg.classList.add('not-active');
        library.addBook(newBook);
        closeForm();
        e.target[0].value = '';
        e.target[1].value = '';
        e.target[2].value = '';
        e.target[3].checked = false;    
    }
    library.saveLocal();
    showBooks();
}

function showBooks(){
    grid.innerHTML = '';
    library.saveLocal();
    library.collection.forEach((book) => {
        grid.innerHTML += ` 
            <div class="grid-book ${library.isDark ? 'dark' : 'light'}">
                <h2>${book.title}</h2>
                <h3>${book.author}</h3>
                <h4>${book.pages} pages</h4>
                <button class="btn btn-status 
                    ${book.isRead ? 'status-read' : 'status-notread'}
                    ${book.id}
                ">
                    ${book.isRead ? 'Read' : 'Not read'}
                </button>
                <button class="btn btn-remove ${book.id}">Remove</button>
            </div>
        `;
    });
    const btnStatus = document.querySelectorAll('.btn-status');
    btnStatus.forEach((btn) => btn.addEventListener('click', handleStatus));        

    const btnRemove = document.querySelectorAll('.btn-remove');
    btnRemove.forEach((btn) => btn.addEventListener('click', handleRemove));        
}
showBooks();

// Handle book status/remove
function handleStatus(e){
    const id = e.target.classList[3];
    const book = library.getBook(id);
    book.isRead ? book.isRead = false : book.isRead = true;
    showBooks();
}

function handleRemove(e){
    const id = e.target.classList[2];
    library.removeBook(id);
    showBooks();
}