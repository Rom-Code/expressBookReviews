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
/*public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});*/
public_users.get('/', async function (req, res) {
    try {
        const booksData = await (async () => books)();

        res.status(200).send(JSON.stringify(booksData, null, 4));
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(400).send('Failed to fetch books');
    }
});

//Get book details based on ISBN
/*public_users.get('/isbn/:isbn', function (req, res) {
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
});*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await (async () => books[isbn])();

        if (book) {
            res.status(200).send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to fetch book by ISBN');
    }
 });


  
// Get book details based on author
/*public_users.get('/author/:author', function (req, res) {
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
});*/

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try{
    const author = req.params.author;
    const booksByAuthor = await (async () => {
        const result = [];
        for (let isbn in books) {
            if (books[isbn].author === author) {
                result.push(books[isbn]);
            }
        }
        return result;
    })();

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor, null, 4));
    } else {
        res.status(404).json({ message: "No books found by this author" });
    
    } }
    catch (error) {
        console.log('Error ocurred', error)
        res.status(500).send('Failed to fetch book by author')
    }
});



// Get all books based on title
/*public_users.get('/title/:title', function (req, res) {
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
});*/

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title.toLowerCase();

        // Simulating an async operation to get books by title
        const booksByTitle = await (async () => {
            const result = [];
            for (let isbn in books) {
                if (books[isbn].title.toLowerCase() === title) {
                    result.push(books[isbn]);
                }
            }
            return result;
        })();

        if (booksByTitle.length > 0) {
            res.status(200).send(JSON.stringify(booksByTitle, null, 4));
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).send('Failed to fetch books by title');
    }
});
//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    
    if (books[isbn]) {
        if (books[isbn].reviews) {
            res.send(JSON.stringify(books[isbn].reviews, null, 4));
        } else {
            res.status(404).json({ message: "No reviews found for this book" });
        }
    } else {
        res.status(404).json({ message: "Book not found" });
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
