const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json({ message: "Books fetch successfully", books: books });
});

public_users.get('/axios-get', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books data: " + error, error: error.message });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let foundBook = books?.[req.params.isbn]
  return res.status(200).json({ message: "Book found", book: foundBook });
});

public_users.get('/axios-get/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/isbn/' + req.params.isbn);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let foundBookList = []
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i] && books[i].author == req.params.author)
      foundBookList.push(books[i])
  }
  return res.status(200).json({ message: "Books found for author name: " + req.params.author, books: foundBookList });
});

public_users.get('/axios-get/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/author/' + req.params.author);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let foundBookList = []
  for (let i = 0; i < Object.keys(books).length; i++) {
    if (books[i] && books[i].title == req.params.title)
      foundBookList.push(books[i])
  }
  return res.status(200).json({ message: "Books found for tilte: " + req.params.author, books: foundBookList });
});


public_users.get('/axios-get/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/title/' + req.params.title);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let foundBook = books?.[req.params.isbn]
  return res.status(200).json({ message: "Book found", book: foundBook?.reviews });
});

module.exports.general = public_users;
