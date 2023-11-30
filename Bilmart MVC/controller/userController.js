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
import tempUserModel from '../model/tempUserModel.js';
import bcrypt from "bcrypt";
import mailer from "./mailController.js"
import secretToken from "./secretToken.js"
import  jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import { passwordStrength } from 'check-password-strength'
cookieParser()
const router = express.Router()
const mailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const bilkentMailRegex = /^[\w-\.]+@([\w-]+\.)+bilkent\.edu\.tr$/
const usernameRegex = /^[\w-\.]+$/

/**
 * 
 */
router.get('/:id', async (req, res) => {
    try {
      const user = await userModel.getUser(req.params.id) //access model func.
      if(user === "User not found") {
        res.status(404).send('User not found')
      } else {
        res.status(200).send(user) //return value
      }
      
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Internal Server Error' })
    }
})
/**
 * Logs in the user
 * @param req.body.email The email of the user
 * @param req.body.password The password oof the user
 */
router.post("/login", async (req, res) => {
    try {
        const user = await userModel.getUserByEmail(req.body.email)
        if(!user) {
          return res.status(404).json({messsage: 'User not found'})
        }
        console.log(req.body.password)
        console.log(user)
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword) {
          return res.status(404).json({messsage: 'Invalid password'})
        }
        const userToken = await secretToken.createSecretUserToken(user._id);
        res.cookie("userToken", userToken, {
          withCredentials: true,
          httpOnly: false,
        })

        return res.status(200).json({ messgae: "Logged in successfully"})

        
      } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Internal Server Error' })
      }
  });
  
/**
 * Signs up a new user
 * 
 * If successfull, sends a verification code to the user email and creates a temporary unverified user
 * Unverified users can be verified by sending a  post request to /user/verify with the verificationCode
 * 
 * @param req.body.email    The email of the new user. The email must be a bilkent email ending with bilkent.edu.tr
 * @param req.body.username The username of the new user. Can only have alphanumeric characters, underscore, dot, and dash
 * @param req.body.password The password of the new user. must be at least medium strength according to check-password-strength
 * 
 * @returns 
 */
router.post("/signup", async (req, res, next) => {
  try {
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
    if(!bilkentMailRegex.test(newUser.email)) {
      return res.json({ message: "This is not a valid bilkent email" });
    }
    if(!usernameRegex.test(newUser.username)) {
      return res.json({ message: "Usernames can only contain alphanumeric characters, dot, dash and underscore" });
    }
    if(passwordStrength(req.body.password).id < 2) {
      return res.json({ message: "Password is too weak" });
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
    existingUser = await tempUserModel.getUserByUserName(newUser.username);
    if(existingUser && existingUser.email != newUser.email) {
      return res.json({ message: "This username is taken" });
    }
    existingUser = await tempUserModel.getUserByEmail(newUser.email);
    if(existingUser) {
      tempUserModel.remove(existingUser._id);
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
    newUser.verificationCode = await bcrypt.hash(verificationCode, 12);
    await tempUserModel.create(newUser);
    const tempUser = await tempUserModel.getUserByUserName(newUser.username);
    try {
      await mailer.sendMail(newUser.email,"Your Verification Code",
      "<h1>Your verification code is: " + verificationCode + "</h1>");
      const tempUserToken = secretToken.createSecretTempUserToken(tempUser._id);
      res.cookie("tempUserToken", tempUserToken, {
        withCredentials: true,
        httpOnly: false,
        secure: false
      });
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
    return res.json({ message: "Internal server error" });
  }
});

/**
 * verifies an unverified user
 * @param req.cookies.tempUserToken this token is generated when posted to user/signup. Contains info about unverified user
 * @param req.body.verificationCode 6 digit verification code sent to the user
 * 
 */
router.post("/verify", async (req, res, next) => {
  try {
    const token = req.cookies.tempUserToken;
    const verificationCode = req.body.verificationCode;
    console.log(token)
    console.log(verificationCode)
    jwt.verify(token, process.env.TEMP_USER_TOKEN_KEY, async (err, data) => {
      if (err) {
       return res.json({ message: "Token couldn't be verified" })
      } else {
        //check if user exists
        const tempUser = await tempUserModel.getUserByUserId(data.id)
        if(!tempUser) {
          return res.json({message: "User Does not exist" })
        }
        //check if verification code is valid
        const validCode = await bcrypt.compare(verificationCode, tempUser.verificationCode);
        if(!validCode) {
          return res.json({message: "Verification code is wrong"})
        }
        //create actual user
        await userModel.create({
          email: tempUser.email,
          username: tempUser.username,
          password: tempUser.password,
          posts: {},
          settings: {},
          wishlist: {},
          description: "",
          rating: 0,
          ratedamount: 0,
          createdAt: new Date()
        })
        const user = await userModel.getUserByEmail(tempUser.email)
        //delete temp user
        tempUserModel.remove(tempUser._id)
        //send user token
        const userToken = await secretToken.createSecretUserToken(user._id)
        res.cookie("userToken", userToken, {
          withCredentials: true,
          httpOnly: false,
        })

        return res.json({ message: "User is verified"})
      }
    })

  } catch (error) {
    console.error(error);
    return res.json({ message: "Email verification failed" });
  }
})
  
 export default router; //allows other files to access the routes