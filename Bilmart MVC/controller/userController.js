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
const router = express.Router()

//this is an example of a specific route which calls a "getAllListings" function
//from the model.
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
router.post("/login", async (req, res) => {
    try {
        const result = await userModel.login(req.body.email, req.body.password) //access model func.
        if(result === "User not found") {
          res.status(404).json('User not found')
        } else {
          res.status(200).json(user) //return value
        }
      } catch (error) {
        console.error(error)
        res.status(500).send({ error: 'Internal Server Error' })
      }
  });
  
router.post("/signup", async (req, res) => {
    let newDocument = {
      email: req.body.email,
      password: req.body.password,
    };
    const result = await userModel.signup(newDocument) //access model func.
    res.send(result).status(204);
});
  
 export default router; //allows other files to access the routes