const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "user1", password:"pass1"},{username: "user2", password:"pass2"}];

const isValid = (username)=>{ //returns boolean
    
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
        } else {
         return false;
        }
    //write code to check is the username is valid
}
    //checks if at least one user in the array has the given username. 
    //It returns true if the username exists, otherwise false.


const authenticatedUser = (username,password)=>{ //returns boolean

    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // check if missing username or password
    if(!username || !password){
        return res.status(400).json({message: "wrong log in"});
    }
    //Authenticate the user
    if(authenticatedUser(username, password)){
        //generate JWT token
        let accessToken = jwt.sign({
            data:password
        }, 'access', { expiresIn: 60 * 60});

        //Store token, username session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("You are logged in sucssfully");
    } else {
        return res.status(401).json({message:"Invalid login. Check again your username and password"})
    }
   
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
