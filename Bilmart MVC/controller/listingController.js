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
import authMiddleware from '../middlewares/authMiddleware.js';
import sharp from 'sharp'
import axios from "axios";
const router = express.Router();

//-----------------------
import TransactionalItem from "../model/Classes/TransactionalItemClass.js";
import Post from "../model/Classes/PostClass.js";
import LendItem from "../model/Classes/LendItemClass.js";
import LostFound from "../model/Classes/LostFoundClass.js";
import Donation from "../model/Classes/DonationClass.js";
//-----------------------



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
router.get("/home", async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const records = await listingModel.getPageListings(pageNumber);
    //console.log(records); //displays all posts loaded in json

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //vvvvvvvvvvvvvvvvvvvvvvvvvv
    //DONT DELETE THE CODE BELOW
    //^^^^^^^^^^^^^^^^^^^^^^^^^^
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    /*
    //-----------

    const sellItem = new TransactionalItem(4, 7, true);
    const lendItem = new LendItem(5, 9, true, 4);
    const donationItem = new Donation("097N78", "www.weblink.com", "stray dogs", 100000)
    const LFItem = new LostFound(false);

    const object = new Post(
        "Title is This",
        new Date(),
        ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        "Descrion is this",
        ['tag1', 'tag2'],
        '123456789012345678901234', // MongoDB user ID
        'sale',
        LFItem
    );

    const jsonString = JSON.stringify(object.toJSON());

    console.log("-----------JSON--------------")
    console.log(jsonString);
    console.log("-----------------------------")

    console.log("get:" + JSON.stringify(object.getProperties()));

    //------------
    */

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //vvvvvvvvvvvvvvvvvvvvvvvvvv
    //DONT DELETE THE CODE ABOVE
    //^^^^^^^^^^^^^^^^^^^^^^^^^^
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    res.json(records);
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});
// router.get('/search', async (req, res) => {
//   try {
//     const listings = await listingModel.searchListings(req.query) //access model func.
//     //console.log(listings)
//     res.send(listings) //return value
//   } catch (error) {
//     console.error(error)
//     res.status(500).send({ error: 'Internal Server Error' })
//   }
// });
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

    //assuming incoming newDoc is:
    /*
      title; //string +
      postDate; //date +
      images; //list of url +
      description; //string +
      tags; //list of string
      postOwner; //url +
      type; //string +
      typeSpecific; // list of variables +

    */

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
    const data = await authMiddleware.validCookie(req)
    if(!data.status) {
      return res.json({success: false, message: 'User token is invalid'})
    }
    //check that user exists
    const user = await userModel.getUser(req.body.postOwner)
    if(!user) {
      return res.json({success: false, message: 'User doesn\'t exist'})
    }
    //check that user token matches request user id
    if(user.username !== data.user) {
      return res.json({success: false, message: 'Incorrect user'})
    }

    console.log("Here---------------------------")

    let itemStrategy;
    let post;

    console.log(req.body)

    //applies specific strategy based on type of post
    let typeSpec = req.body.typeSpecific;
    if (req.body.type === "Sale Item") {
      itemStrategy = new TransactionalItem(typeSpec.price, typeSpec.quality, typeSpec.available);
    } else if (req.body.type === "Borrowal Item") {
      itemStrategy = new LendItem(typeSpec.price, typeSpec.quality, typeSpec.available, typeSpec.duration)
    } else if (req.body.type === "Donation") {
      itemStrategy = new Donation(typeSpec.IBAN, typeSpec.weblink, typeSpec.organizationName, typeSpec.monetaryTarget)
    } else if (req.body.type === "Lost Item") {
      itemStrategy = new LostFound(typeSpec.found)
    } else {
      console.error(error)
      res.status(500).send({ error: 'No appropriate item type was selected when creating a post.' })
    }

    //create a post object with unique type
    post = new Post(
        req.body.title,
        new Date(),
        req.body.images,
        req.body.description,
        req.body.tags,
        req.body.postOwner,
        req.body.type,
        itemStrategy
    );

    //newDoc is equal to post object in JSON format
    let newPostDocument = post.toJSON();

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

    const result = await listingModel.postListing(newPostDocument) //access model func.

    //--------------------
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



    res.send(result).status(204);
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
});

router.patch("/:id", async (req, res) => {
  try {
    //check cookkie validity
    const data = await authMiddleware.validCookie(req)
    if(!data.status) {
      return res.json({success: false, message: 'User token is invalid'})
    }
    //check that user exists
    const user = await userModel.getUser(req.body.postOwner)
    if(!user) {
      return res.json({success: false, message: 'User doesn\'t exist'})
    }
    //check that user token matches request user id
    if(user.username !== data.user) {
      return res.json({success: false, message: 'Incorrect user'})
    }
    //check sizes and formats of request objects
    if(req.body.title.length <= 2  || req.body.title.length > 100) {
      return res.json({success: false, message: 'The title should be between 4 and 99 characters long'})
    }
    if(req.body.description.length > 2000) {
      return res.json({success: false, message: 'The description should be less than 2000 characters long'})
    }
    //check that price is a number
    if(!/^\d+$/.test(req.body.price) && req.body.price != '') {
      return res.json({success: false, message: 'Price should be a number'})
    }
    //check images
    if(req.body.images.length > 5) {
      return res.json({success: false, message: 'A post can contain at most 5 images'})
    }
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
