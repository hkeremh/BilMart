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
import { ObjectId } from "mongodb";
import listingModel from '../model/listingModel.js'; //this line allows controller to use methods from model
const router = express.Router();
 
//this is an example of a specific route which calls a "getAllListings" function
//from the model.
router.get('/', async (req, res) => {
    try {
      const listings = await listingModel.getAllListings() //access model func.
      res.send(listings) //return value
    } catch (error) {
      console.error(error)
      res.status(500).send({ error: 'Internal Server Error' })
    }
})

router.get('/:id', async (req, res) => {
  try {
    const query = {_id: new ObjectId(req.params.id)};
    const listing = await listingModel.getListing(query) //access model func.
    if(listing === "Listing not found") {
      res.status(404).send('Listing not found')
    } else {
      res.status(200).send(listing) //return value
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
})

router.post("/", async (req, res) => {
  try {
    let newDocument = {
      title: req.body.title,
      description: req.body.description,
      availability: req.body.availability,
      type: req.body.type,
      price: req.body.price,
      src: req.body.src
    };
    const result = await listingModel.postListing(newDocument) //access model func.
    res.send(result).status(204);
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
      $set: {
        title: req.body.title,
        description: req.body.description,
        availability: req.body.availability,
        type: req.body.type,
        price: req.body.price,
        src: req.body.src
      }
    };
    const result = await listingModel.updateListing(query, updates) //access model func.
    res.send(result).status(200);
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const result = await listingModel.deleteListing(query) //access model func.
  res.send(result).status(200);
});
  
  export default router; //allows other files to access the routes
