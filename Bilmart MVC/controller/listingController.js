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
import dns from 'dns'

const router = express.Router();

//-----------------------
import TransactionalItem from "../model/Classes/TransactionalItemClass.js";
import Post from "../model/Classes/PostClass.js";
import LendItem from "../model/Classes/LendItemClass.js";
import LostFound from "../model/Classes/LostFoundClass.js";
import Donation from "../model/Classes/DonationClass.js";
import ProxyPost from "../model/Classes/ProxyPostClass.js";
import mailer from "./mailController.js";
//-----------------------

async function isValidWebLink(link) {
  try {
    const formattedLink = link.startsWith('http') ? link : `https://${link}`;
    const dnsPromise = new Promise((resolve) => {
      dns.resolve(formattedLink, (error) => {
        resolve(!error);
      });
    });
    const response = await axios.get(formattedLink);

    const dnsResult = await dnsPromise;
    const httpResult = response.status >= 200 && response.status < 300;

    // Check if the response status is in the range of 200 to 299
    return dnsResult || httpResult;
  } catch (err) {
    // Handle errors, e.g., network errors or non-2xx HTTP responses
    return false;
  }

}
async function sendNotification(wishlist, post) {
  for (const id of wishlist) {
    try {
      const user = await userModel.getUser(id);
      await mailer.wishlistNotificationToViewer(user,post); //change
    } catch (err) {
      console.error(err);
    }
  }
}

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
    const records = await proxyListingModel.getPageListings(pageNumber);
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
router.get('/proxy/:id', async (req, res) => {
  try {
    const query = {realID: new ObjectId(req.params.id)};
    const listing = await proxyListingModel.getListing(query) //access model func.
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
        !req.body.postOwner ||
        !req.body.type ||
        !req.body.images
    ) {
      return res.json({message: 'Please fill all the missing sections'})
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

    let itemStrategy;
    let post;


    //applies specific strategy based on type of post
    let typeSpec = req.body.typeSpecific;

    let hasEmptyProperty = false;

    Object.entries(typeSpec).forEach(([property, value]) => {
      if (value === '' || value === undefined || value === null) {
        hasEmptyProperty = true;
      }
    });

    if (hasEmptyProperty) {
      return res.json({ success: false, message: 'Please fill in all properties' });
    }
    if (req.body.type === "Sale Item") {
      itemStrategy = new TransactionalItem(typeSpec.price, typeSpec.quality, typeSpec.available);
    } else if (req.body.type === "Borrowal Item") {
      itemStrategy = new LendItem(typeSpec.price, typeSpec.quality, typeSpec.available, typeSpec.duration)
    } else if (req.body.type === "Donation") {
        try {
          const exists = await isValidWebLink(typeSpec.weblink);
          if (exists) {
            itemStrategy = new Donation(typeSpec.IBAN, typeSpec.weblink, typeSpec.organizationName, typeSpec.monetaryTarget)
            // return res.json({ success: false, message: `${typeSpec.weblink} exists.` });
          } else {
            return res.json({ success: false, message: `${typeSpec.weblink} does not exists.` });
          }
        } catch (error) {
          console.error('Error:', error.message);
          return res.status(500).json({ success: false, message: 'DNS check Error' });
        }
    } else if (req.body.type === "Lost Item" || req.body.type === "Found Item") {
      itemStrategy = new LostFound(typeSpec.status)
    } else {
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
        itemStrategy,
        req.body.wishlistCount
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
    // //check that price is a number
    // if((newPostDocument.typeSpecific.price) && /^\d+(\.\d*)?(\.\d+)?$/.test(newPostDocument.typeSpecific.price)) {
    //   return res.json({success: false, message: 'Price should be a number!'})
    // }
    //check images
    if(newPostDocument.images.length > 5) {
      return res.json({success: false, message: 'A post can contain at most 5 images'})
    }


    const result = await listingModel.postListing(newPostDocument) //access model func.


    //--------------------

    let proxyPost = new ProxyPost(
        result.insertedId,
        req.body.title,
        new Date(),
        '',
        req.body.description,
        req.body.tags,
        req.body.postOwner,
        req.body.type,
        itemStrategy
    );

    //compress first image for proxy
    try {
      const uri = newPostDocument.images[0].split(';base64,').pop()
      let imgBuffer = Buffer.from(uri, 'base64');
      await sharp(imgBuffer)
          .resize(300, 300, {fit: 'inside'})
          .toFormat('png')
          .toBuffer()
          .then(data => {
            console.log('success')
            // newProxyPostDocument.image = `data:image/png;base64,${data.toString('base64')}`
            proxyPost.image = `data:image/png;base64,${data.toString('base64')}`;
            // proxyListingModel.create(newProxyPostDocument);
            console.log(proxyPost.toJSON())
            proxyListingModel.create(proxyPost.toJSON());
            console.log("sent to prxy")
          })
          .catch(err => {
            console.log(`downisze issue ${err}`)
          })
    } catch (e) {
      return res.json({success: false, message: `downisze issue ${err}`})
    }


    return res.json({success: true, message: "Post created successfully"});



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
    // if(req.body.typeSpecific.price && !/^\d+$/.test(req.body.typeSpecific.price) && req.body.typeSpecific.price != '') {
    //   return res.json({success: false, message: 'Price should be a number'})
    // }
    //check images
    if(req.body.images.length > 5) {
      return res.json({success: false, message: 'A post can contain at most 5 images'})
    }
    let itemStrategy;

    //applies specific strategy based on type of post
    let typeSpec = req.body.typeSpecific;
    let hasEmptyProperty = false;
    //VVVVVV
    //need to send type spec.
    //^^^^^^
    if (typeSpec !== undefined && typeSpec !== null) {
      Object.entries(typeSpec).forEach(([property, value]) => {
        if (value === '' || value === undefined || value === null) {
          hasEmptyProperty = true;
        }
      });
    }

    if (hasEmptyProperty) {
      return res.json({ success: false, message: 'Please fill in all properties' });
    }
    if (req.body.type === "Sale Item") {
      itemStrategy = new TransactionalItem(typeSpec.price, typeSpec.quality, typeSpec.available);
    } else if (req.body.type === "Borrowal Item") {
      itemStrategy = new LendItem(typeSpec.price, typeSpec.quality, typeSpec.available, typeSpec.duration)
    } else if (req.body.type === "Donation") {
      try {
        const exists = await isValidWebLink(typeSpec.weblink);
        if (exists) {
          itemStrategy = new Donation(typeSpec.IBAN, typeSpec.weblink, typeSpec.organizationName, typeSpec.monetaryTarget)
          // return res.json({ success: false, message: `${typeSpec.weblink} exists.` });
        } else {
          return res.json({ success: false, message: `${typeSpec.weblink} does not exists.` });
        }
      } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ success: false, message: 'DNS check Error' });
      }
    } else if (req.body.type === "Lost Item" || req.body.type === "Found Item") {
      itemStrategy = new LostFound(typeSpec.status)
    } else {
      res.status(500).send({ error: 'No appropriate item type was selected when creating a post.' })
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
        typeSpecific: itemStrategy
      }
    };


    const wishlist = req.body.wishlist;
    const post = req.body
    await sendNotification(wishlist, post)

    const result = await listingModel.updateListing(query, updates) //access model func.
    //edit proxy post



    query = { realID: new ObjectId(req.params.id) };
    let proxyUpdates =  {
      $set: {
        title: req.body.title,
        description: req.body.description,
        availability: req.body.availability,
        type: req.body.type,
        typeSpecific: itemStrategy
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
