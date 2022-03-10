// Class book, with constructor
class Book {
    constructor(title = 'Unknown', author = 'Unknown', pages = 0, read = false){
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }
}

// Class library, with constructor and functions
class Library {
    constructor(){
        this.collection = [];
    }

    addBook(newBook){
        if(!this.isInCollection(newBook)){
            this.collection.push(newBook);
        }
    }

    isInCollection(newBook){
        return this.collection.some((book) => book.title == newBook.title);
    }

    removeBook(title){
        return this.collection.filter((book) => book.title != title);
    }

    getBook(title){
        return this.collection.find((book) => book.title == title);
    }

    getCollection(){
        return this.collection;
    }
}

// Get all necessary DOM nodes
const sunMode = document.querySelector('.sun-mode');
const btnAdd = document.querySelector('.btn-add');
const grid = document.querySelector('.grid');
const btnStatus = document.querySelector('.btn-status');
const btnRemove = document.querySelector('.btn-remove');

const bookForm = document.querySelector('.book-form');
const aside = document.querySelector('aside');

// Declare necessary variables
const library = new Library();
let isDark = false;

// Handle wether the user wants dark/lightmode
sunMode.addEventListener('click', handleMode);

function handleMode(){
    const header = document.querySelector('header');
    const body = document.querySelector('body');
    const gridBook = document.querySelectorAll('.grid-book');
    isDark ? lightMode(header, body, gridBook) : darkMode(header, body, gridBook);
}

function darkMode(header, body, grid){
    header.style.backgroundColor = '#333333';
    header.style.color = '#FFF';
    body.style.backgroundColor = '#7F7F7F';
    grid.forEach((div) => {
        div.style.backgroundColor = '#333333';
        div.style.color = '#FFF'
    });
    bookForm.style.backgroundColor = '#333333';
    bookForm.style.color = '#FFF';
    isDark = true;
}

function lightMode(header, body, grid){
    body.style.backgroundColor = '#F0EEF1';
    header.style.backgroundColor = '#FFFBFB';
    header.style.color = '#000';
    grid.forEach((div) => {
        div.style.backgroundColor = '#FFFBFB';
        div.style.color = '#000'
    });
    bookForm.style.backgroundColor = '#FFFBFB';
    bookForm.style.color = '#000';
    isDark = false;
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
