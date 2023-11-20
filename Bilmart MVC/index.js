/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * This is the entry point for the server. Here we setup everything.
 * The server is started by typing: "npm run dev" (for nodemon, which auto refreshes server after save)
 * or sometimes "npm start dev" also works. Other wise just "node start"
 */

const express = require('express');
const db = require('./database/database.js');
const controller = require('./controller/controller.js');
const cors = require('cors');


const app = express();
const port = 5000; //server is established at localhost:5000 by default

//connect to db
db.connect().catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

/**
 * This means that every link with ">WEBSITE_NAME</" will use the controller.js defined above
 * In the future if need to do something like: bilmart/login, we would need to create a new loginController.js
 * inside the controller folder and all methods relating to login there.
*/
app.use('/', controller);
app.use(cors());

//just prints a message when nodejs server is started.
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


