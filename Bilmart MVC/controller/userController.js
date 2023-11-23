/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * This is a controller and each /url can have a unque controller such as:
 * - In the future if need to do something like: bilmart/login, we would need to create a new loginController.js
 * inside the controller folder and all methods relating to login there.
 * 
 */
import express from 'express';
import userModel from '../model/userModel.js'; //this line allows controller to use methods from model
import bcrypt from "bcrypt";
import mailer from "./mailController.js"

const router = express.Router()

//this is an example of a specific route which calls a "getAllListings" function
//from the model.
router.get('/:id', async (req, res) => {
    try {
      const user = await userModel.getUser(req.params.id) //access model func.
      if(user === "User not found") {
        res.status(404).json('User not found')
      } else {
        res.status(200).json(user) //return value
      }
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Internal Server Error' })
    }
})
router.post("/login", async (req, res) => {
    try {
        const result = await userModel.login(req.body.email, req.body.password) //access model func.
        if(result === "User not found") {
          res.status(404).json({messsage: 'User not found'})
        } else {
          res.status(200).json(user) //return value
        }
      } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Internal Server Error' })
      }
  });
  
router.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body)
    const encryptedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = {
      email: req.body.email,
      username: req.body.username,
      password: encryptedPassword,
      posts: {},
      settings: {},
      wishlist: {},
      description: "",
      rating: 0,
      ratedamount: 0,
      createdAt: new Date()
    }
    //TODO check that email, username, password is valid
    let existingUser = await userModel.getUserByEmail(newUser.email);
    if(existingUser) {
      return res.json({ message: "This email is taken" });
    }
    existingUser = await userModel.getUserByUserName(newUser.username);
    if(existingUser) {
      return res.json({ message: "This username is taken" });
    }
    //create 6 digit verification code
    const verificationLength = 6;
    const verificationCodeArr = new Uint16Array(verificationLength);
    let verificationCode = "";
    //get 6 random numbers
    crypto.getRandomValues(verificationCodeArr);
    for (let index = 0; index < verificationCodeArr.length; index++) {
      //turn numbers to digits and put in a string
      verificationCodeArr[index] = verificationCodeArr[index] % 10;
      verificationCode = verificationCode + verificationCodeArr[index].toString();
    }
    const tempUser = userModel.create(newUser);
    try {
      await mailer.sendMail(newUser.email,"Your Verification Code",
      "<h1>Your verification code is: " + verificationCode + "</h1>");
      res
        .status(201)
        .json({ message: "Verification mail sent successfully", success: true, tempUser });
      next()
    } catch (error) {
      console.error(error);
      return res.json({ message: "Email couldn't be sent" });

    
    }

    
  } catch (error) {
    console.error(error);
    return res.json({ message: "Email couldn't be sent" });
  }
  
  
    // let newDocument = {
    //   email: req.body.email,
    //   password: req.body.password,
    // };
    // const result = await userModel.signup(newDocument) //access model func.
    // res.send(result).status(204);
});
  
 export default router; //allows other files to access the routes