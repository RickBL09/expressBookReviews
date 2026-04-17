const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: "This username already exists"
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered"
  });
});

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books"
    });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book by ISBN"
    });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`${BASE_URL}/author/${author}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books by author"
    });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`${BASE_URL}/title/${title}`);
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching book by title"
    });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  return res.send(books[isbn].reviews);
});

module.exports.general = public_users;