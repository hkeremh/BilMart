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
      const listings = await listingModel.getAllListings() //access model func.
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
    let newDocument = post.toJSON();
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
