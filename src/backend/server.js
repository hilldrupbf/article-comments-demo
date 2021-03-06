const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const history = require('connect-history-api-fallback');
const cors = require('cors');
const db = require('./blog_db');
const app = express();

app.use(cors());
// Parses incoming request object as a JSON object
app.use(express.json());
// Sends Routes all traffic through index.html so vue-router
// can handle redirecting front end
app.use(
  history({
    // Overwrites GET request to /article from being routed through index.html
    rewrites: [{ from: /\/article/, to: '/article' }],
  })
);

/**
 * Authentication Requests
 */

// Handles login requests
app.post('/login', async (req, res) => {
  const username = req.body.username;
  let message;

  // Get user data from DB
  let user = await db.getUser(username);
  // Query returns an array of objects and this gets the first(only) one
  if (user.length !== 1) {
    message = 'User not found!';
    return res.json(message);
  } else {
    user = user[0];
  }

  // Validate login info
  try {
    // returns false if password incorrect
    (await bcrypt.compare(req.body.password, user.password))
      ? (message = 'Success')
      : (message = 'Password incorrect!');
  } catch {
    // Server error
    return (message = 'Internal server error');
  } finally {
    return res.json(message);
  }
});

// Handles sign up requests
app.post('/signup', async (req, res) => {
  try {
    try {
      // Get user data from DB
      const dbUser = await db.getUser(req.body.username);
      if (dbUser.length >= 1) {
        return res.json({
          message: 'User already exists, please pick a differnt username',
        });
      }
    } catch (e) {
      console.log(e.message);
      return res.json({ message: 'Internal server error' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };

    // Create user in DB
    const results = await db.addNewUser(user);

    if (results.affectedRows === 1) {
      return res.json({ message: 'Success' });
    } else {
      return res.json({ message: 'User not added!' });
    }
  } catch {
    return res.json({ message: 'Internal server error' });
  }
});

/**
 * Comment Requests
 */

// Handles POST requests to add a comment
app.post('/article', cors(), async (req, res) => {
  // Gets chosen criteria into local variable
  const uname = req.body.uname,
    commentBody = req.body.commentBody,
    depth = req.body.depth,
    timestamp = req.body.timestamp;
  const parentId = req.body.parentId ? req.body.parentId : null;

  // Inserts new comment into database
  const newId = await db.addComment(
    timestamp,
    uname,
    commentBody,
    depth,
    parentId
  );

  console.log(`New post added with id: ${newId}`);
  res.json(newId);
});

// Handles GET request to retrieve all comments
app.get('/article', async (req, res) => {
  const comments = await db.getRootComments();
  res.json(comments);
});

// src folder is two folders above server.js file, and in the static dist folder
const rootDir = path.join(__dirname, '..', '..', '/dist/');

// Default handler
app.use(express.static(path.join(rootDir)));

// Listen for any incoming requests
app.listen(5000);

console.log('Node.js web server at port 5000 is running...');
