/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * This is a controller and each /url can have a unque controller such as:
 * - In the future if need to do something like: bilmart/login, we would need to create a new loginController.js
 * inside the controller folder and all methods relating to login there.
 * 
 */
const express = require('express')
const router = express.Router()
const model = require('../model/model.js') //this line allows controller to use methods from model


//this is an example of a specific route which calls a "getAllListings" function
//from the model.
router.get('/listings', async (req, res) => {
    try {
      const listings = await model.getAllListings() //access model func.
      res.json(listings) //return value
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
})
  
  module.exports = router //allows other files to access the routes
