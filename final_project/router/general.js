const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.query.username;
    const password = req.query.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn;
        console.log('Received ISBN:', isbn); // Log received ISBN
        const book = books[isbn];
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    try {
        const authorName = req.params.author.toLowerCase(); // Retrieve and normalize the author's name from request parameters
        const matchingBooks = [];

        // Iterate over all keys in the books object
        for (const key in books) {
            if (books.hasOwnProperty(key)) {
                const book = books[key];
                // Check if the author matches the request parameter
                if (book.author.toLowerCase() === authorName) {
                    matchingBooks.push(book); // Add matching book to the results array
                }
            }
        }

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Send the list of matching books as a JSON response
        } else {
            res.status(404).json({ message: "No books found for the specified author" }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving books by author" }); 
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    try {
        const bookTitle = req.params.title.toLowerCase(); // Retrieve and normalize the book title from request parameters
        const matchingBooks = [];

        // Iterate over all keys in the books object
        for (const key in books) {
            if (books.hasOwnProperty(key)) {
                const book = books[key];
                // Check if the book title matches the request parameter
                if (book.title.toLowerCase() === bookTitle) {
                    matchingBooks.push(book); // Add matching book to the results array
                }
            }
        }

        if (matchingBooks.length > 0) {
            res.json(matchingBooks); // Send the list of matching books as a JSON response
        } else {
            res.status(404).json({ message: "No books found with the specified title" }); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book details by title" }); 
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    try {
        const isbn = req.params.isbn; // Retrieve the ISBN from the URL parameters
        const book = books[isbn]; // Retrieve the book object using ISBN as the key

        if (book && book.reviews) {
            // Check if the book exists and has reviews
            
            res.json(book.reviews); // Send the book reviews as a JSON response
        } else if (book) {
            // If the book exists but has no reviews
            res.status(404).json({ message: "No reviews available for this book" });
        } else {
            // If the book does not exist
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error retrieving book reviews" });
    }
});

module.exports.general = public_users;
