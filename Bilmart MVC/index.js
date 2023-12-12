/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * This is the entry point for the server. Here we setup everything.
 * The server is started by typing: "npm run dev" (for nodemon, which auto refreshes server after save)
 * or sometimes "npm start dev" also works. Other wise just "node start"
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import "./loadEnvironment.js";
import listingController from './controller/listingController.js';
import userController from './controller/userController.js';
const app = express();
const port = 4000; //server is established at localhost:4000 by default

/**
 * This means that every link with ">WEBSITE_NAME</" will use the controller.js defined above
 * In the future if need to do something like: bilmart/login, we would need to create a new loginController.js
 * inside the controller folder and all methods relating to login there.
*/
app.use(bodyParser.json({ limit: '50mb' }))
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/listing', listingController);
app.use('/user', userController);

//just prints a message when nodejs server is started.
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


