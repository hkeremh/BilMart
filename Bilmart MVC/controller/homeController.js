import express from 'express';
import userModel from '../model/userModel.js';
import listingModel from '../model/listingModel.js';
import  jwt from "jsonwebtoken";

const router = express.Router()

/**
 * Send a get request to /home to get user data and posts
 * @param res.body.user     The user data
 * @param res.body.posts    Array of posts to be shown
 */
router.get("/", async (req, res, next) => {
    //check token
    const decoded = await jwt.verify(req.cookies.userToken, process.env.USER_TOKEN_KEY)
    if(!decoded.id) {
        return res.status(404).json({message: "Invalid user token"})
    }
    const user = await userModel.getUser(decoded.id)
    if(!user) {
        return res.status(404).json({message: "User doesn't exist"})
    }
    //if token is valid, send home page data
    return res.status(200).json({
        user: user,
        posts: await listingModel.getAllListings()  //for now
    })
}) 
export default router