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
import proxyListingModel from '../model/postProxyModel.js';
import userModel from '../model/userModel.js';
import sharp from 'sharp'
import axios from "axios";
const router = express.Router();
//this is an example of a specific route which calls a "getAllListings" function
//from the model.
router.get('/', async (req, res) => {
    try {
      //const listings = await listingModel.getAllListings() //access model func.
      const listings = await proxyListingModel.getAllListings()
      //console.log(listings)
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

router.get('/userPosts/:id', async (req, res) => {
  try {
    const listing = await listingModel.getUserListings(req.params.id); //access model func.
    res.status(200).json(listing) //return value
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

//creates new listing
router.post("/", async (req, res) => {
  try {
    //check request format
    if(!req.body.title || 
      !req.body.description || 
      !req.body.availability ||
      !req.body.postOwner || 
      !req.body.type ||
      !req.body.images
      ) {
        return res.status(404).send({error: 'Request format is incorrect'})
      }
      console.log('aa:'+ req.cookies.userToken)
      const cookies = req.cookies;
      const { data } = await axios.post(
              "http://localhost:4000/user/",
              {headers: {
                Cookie: "userToken=" + req.cookies.userToken, // Replace with your cookie value
              }},
              { withCredentials: true },
              
            );
      console.log(data)

      let newPostDocument = {
        title: req.body.title,
        postDate: new Date(),
        images: req.body.images,
        description: req.body.description,
        availability: req.body.availability,
        type: req.body.type,
        postOwner: req.body.postOwner,
        price: req.body.price
      };
    //check sizes and formats of request objects
    if(newPostDocument.title.length <= 3  || req.body.title.length > 100) {
      return res.status(404).send({error: 'The title should be between 3 and 100 characters long'})
    }
    if(newPostDocument.description.length > 2000) {
      return res.status(404).send({error: 'The description should be less than 2000 characters long'})
    }
    //check that the user exists
    //verify cookie
    //create real post
    const result = await listingModel.postListing(newPostDocument) //access model func.

    //create proxy post
    let newProxyPostDocument = {
      realID: result.insertedId,
      title: req.body.title,
      postOwner: req.body.postOwner,
      description: req.body.description,
      postDate: new Date(),
      availability: req.body.availability,
      type: req.body.type,
      price: req.body.price
    }
    //compress first image for proxy
    const uri = newPostDocument.images[0].split(';base64,').pop()
    let imgBuffer = Buffer.from(uri, 'base64');
    sharp(imgBuffer)
    .resize(200, 200, {fit: 'inside'})
    .toFormat('png')
    .toBuffer()
    .then(data => {
        console.log('success')
        newProxyPostDocument.image = `data:image/png;base64,${data.toString('base64')}`
        proxyListingModel.create(newProxyPostDocument);
    })
    .catch(err => console.log(`downisze issue ${err}`))
    
    

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
        postDate: req.body.postDate,
        images: req.body.images,
        description: req.body.description,
        availability: req.body.availability,
        type: req.body.type,
        postOwner: req.body.postOwner,
        price: req.body.price,
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
