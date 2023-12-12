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
//returns posts by a user
router.get('/userPosts/:id', async (req, res) => {
  try {
    const listing = await proxyListingModel.getUserListings(req.params.id); //access model func.
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
        return res.json({message: 'Request format is incorrect'})
      }
      //verify user cookie
      const { data } = await axios.post(
        "http://localhost:4000/user/", {},
        {
          headers: {
              Cookie: "userToken=" + req.cookies.userToken + ";"
          }
        }
        
      );
      if(!data.status) {
        return res.json({success: false, message: 'User token is invalid'})
      }
      //check that user exists
      const user = await userModel.getUser(req.body.postOwner)
      if(!user) {
        return res.json({success: false, message: 'User doesn\'t exist'})
      }
      //check that user token matches request user id
      console.log(user)
      console.log(data.user)
      if(user.username !== data.user) {
        return res.json({success: false, message: 'Incorrect user'})
      }

      let newPostDocument = {
        title: req.body.title,
        postDate: new Date(),
        images: req.body.images,
        description: req.body.description,
        availability: "Available",
        type: req.body.type,
        postOwner: req.body.postOwner,
        price: req.body.price
      };
    //check sizes and formats of request objects
    if(newPostDocument.title.length <= 2  || req.body.title.length > 100) {
      return res.json({success: false, message: 'The title should be between 4 and 99 characters long'})
    }
    if(newPostDocument.description.length > 2000) {
      return res.json({success: false, message: 'The description should be less than 2000 characters long'})
    }
    //check that price is a number
    if(!/^\d+$/.test(newPostDocument.price)) {
      return res.json({success: false, message: 'Price should be a number'})
    }
    //check images
    if(newPostDocument.images.length > 5) {
      return res.json({success: false, message: 'A post can contain at most 5 images'})
    }
    for (let i = 0; i < newPostDocument.images.length; i++) {
      if(newPostDocument.images[i].length > 1000000) {

      }
      
    }
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
    await sharp(imgBuffer)
    .resize(300, 300, {fit: 'inside'})
    .toFormat('png')
    .toBuffer()
    .then(data => {
        console.log('success')
        newProxyPostDocument.image = `data:image/png;base64,${data.toString('base64')}`
        proxyListingModel.create(newProxyPostDocument);
        console.log(newProxyPostDocument.image.length);
    })
    .catch(err => {return res.json({success: false, message:`downisze issue ${err}`})})
    
    

    res.json({success: true, message: "Post created in successfully"});
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.patch("/:id", async (req, res) => {
  try {
    //edit real post
    let query = { _id: new ObjectId(req.params.id) };
    let updates =  {
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
    //edit proxy post
    query = { realID: new ObjectId(req.params.id) };
    let proxyUpdates =  {
      $set: {
        title: req.body.title,
        description: req.body.description,
        availability: req.body.availability,
        type: req.body.type,
        price: req.body.price
      }
      
    };
    const uri = req.body.images[0].split(';base64,').pop()
    let imgBuffer = Buffer.from(uri, 'base64');
    try{
      await sharp(imgBuffer)
      .resize(300, 300, {fit: 'inside'})
      .toFormat('png')
      .toBuffer()
      .then(async data => {
          console.log('success')
          proxyUpdates.$set.image = `data:image/png;base64,${data.toString('base64')}`
          await proxyListingModel.updateListing(query, proxyUpdates) //access model func.

      })
      .catch(err => {console.log(`downisze issue ${err}`)})
      
    }
    catch(err) {
      return res.json({success: false, message:`downisze issue ${err}`})
    }
   

    return res.json({success: true, message: "Edited post successfully"})

  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.delete("/:id", async (req, res) => {
  let query = { _id: new ObjectId(req.params.id) };
  const result = await listingModel.deleteListing(query) //access model func.
  query = { realID: new ObjectId(req.params.id) };
  await proxyListingModel.deleteListing(query) //access model func.
   
  res.send(result).status(200);
});
  
  export default router; //allows other files to access the routes
