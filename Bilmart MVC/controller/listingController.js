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

/**
 * Validates a web link by checking DNS resolution and HTTP response status.
 *
 * @param {string} link - The web link to be validated.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating the validity of the web link.
 * @throws {Error} - If there are network errors or non-2xx HTTP responses during the validation process.
 */
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

/**
 * Sends notifications to users in a wishlist about a new post.
 *
 * @param {Array<string>} wishlist - An array of user IDs representing the wishlist.
 * @param {object} post - The post object for which notifications are sent.
 * @throws {Error} - If there are errors during
 */
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

/**
 * Route handler for retrieving all listings.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
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

/**
 * Route handler for retrieving a paginated list of records for the home page.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.get("/home", async (req, res) => {
  try {
    const pageNumber = Number(req.query.pageNumber) || 1;
    const records = await proxyListingModel.getPageListings(pageNumber);
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

/**
 * Route handler for retrieving all tags.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.get('/tags', async (req, res) => {
  try {
    const tags = await listingModel.getAllTags() //access model func.
    res.send(tags) //return value
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
})

/**
 * Route handler for retrieving a listing by ID.
 *
 * @param {object} req - Express request object with the listing ID as a parameter.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
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

/**
 * Route handler for reporting a listing by ID.
 *
 * @param {object} req - Express request object with the listing ID as a parameter and report details in the request body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.post('/report/:id', async (req, res) => {
  try {
    const query = {_id: new ObjectId(req.params.id)};
    const listing = await listingModel.getListing(query) //access model func.
    if(listing === "Listing not found") {
      res.status(404).send('Listing not found')
    } else {
      const result = await mailer.reportListing(req.body.reporter, req.body.reportedPost, req.body.reportReason) //access model func.
      res.status(200).send({success: true, message: "Listing reported successfully"}) //return value
    }
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }
})

/**
 * Route handler for retrieving a proxy listing by its real ID.
 *
 * @param {object} req - Express request object with the real listing ID as a parameter.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
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

/**
 * Route handler for retrieving listings associated with a specific user.
 *
 * @param {object} req - Express request object with the user ID as a parameter.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.get('/userPosts/:id', async (req, res) => {
  try {
    const listing = await proxyListingModel.getUserListings(req.params.id); //access model func.
    res.status(200).json(listing) //return value
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

/**
 * Route handler for creating a new post and its corresponding proxy with a compressed image.
 *
 * @param {object} req - Express request object containing post details in the request body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
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
          .then( async data => {
            console.log('success')
            // newProxyPostDocument.image = `data:image/png;base64,${data.toString('base64')}`
            proxyPost.image = `data:image/png;base64,${data.toString('base64')}`;
            // proxyListingModel.create(newProxyPostDocument);
            console.log(proxyPost.toJSON())
            await proxyListingModel.create(proxyPost.toJSON());
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

/**
 * Route handler for updating an existing post and its corresponding proxy.
 *
 * @param {object} req - Express request object containing post details in the request body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
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

/**
 * Route handler for deleting a post and its corresponding proxy by ID.
 *
 * @param {object} req - Express request object with the post ID as a parameter.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.delete("/:id", async (req, res) => {
  let query = { _id: new ObjectId(req.params.id) };
  const result = await listingModel.deleteListing(query) //access model func.
  query = { realID: new ObjectId(req.params.id) };
  await proxyListingModel.deleteListing(query) //access model func.

  res.send(result).status(200);
});

/**
 * Route handler for searching listings based on various criteria.
 *
 * @param {object} req - Express request object with search parameters in the request body.
 * @param {object} res - Express response object.
 * @returns {Promise<void>} - Promise resolving to the response being sent.
 */
router.post('/search', async (req, res) => {
  try {
    console.log(req.body);
    let searchQuery = {
      text: req.body.text,
      type: req.body.type,
      tags: req.body.tags,
      availability: req.body.availability,
      orderBy: req.body.orderBy,
      pageNumber: req.body.pageNumber
    }
    if(req.body.type.includes("Lost&Found")) {
      searchQuery.type = [ ...searchQuery.type.filter((e) => e !== "Lost&Found"), "Lost Item", "Found Item"];
      console.log("UPDATED:", searchQuery.type);
    }
    const listings = await listingModel.searchListings(searchQuery) //access model func.
    res.send(listings) //return value
  } catch (error) {
    console.error(error)
    res.status(500).send({ error: 'Internal Server Error' })
  }

})

/* router.post('/search', async (req, res) => {
  try {
    console.log(req.body);
    let searchQuery = {
      text: req.body.text,
      type: req.body.type,
      tags: req.body.tags,
      availability: req.body.availability,
      orderBy: req.body.orderBy,
      pageNumber: req.body.pageNumber
    };

    // Include logic to handle general tags
    if (req.body.generalTag) {
      // Assuming general tags are stored in a separate collection or field
      const generalTagsList = await listingModel.getAllTags(); // You need to implement this method
      searchQuery.tags = [...searchQuery.tags, ...generalTagsList];
      console.log(searchQuery.tags);
    }

    if (searchQuery.type.includes("Lost&Found")) {
      searchQuery.type = [...searchQuery.type.filter((e) => e !== "Lost&Found"), "Lost Item", "Found Item"];
      console.log("UPDATED:", searchQuery.type);
    }

    const listings = await listingModel.searchListings(searchQuery); // Access model func.
    res.send(listings); // Return value
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}) */
/*router.post('/search', async (req, res) => {
  try {
    let searchQuery = {
      text: req.body.text,
      type: req.body.type,
      tags: req.body.tags,
      availability: req.body.availability,
      orderBy: req.body.orderBy,
      pageNumber: req.body.pageNumber,
    };

    // Include logic to handle general tags
    if (req.body.generalTag) {
      const generalTagsList = await listingModel.getAllTags();
      searchQuery.tags = [...searchQuery.tags, ...generalTagsList];
    }

    if (searchQuery.type.includes("Lost&Found")) {
      searchQuery.type = [...searchQuery.type.filter((e) => e !== "Lost&Found"), "Lost Item", "Found Item"];
    }

    // Assuming each listing has a 'tags' field representing an array of tags
    const listings = await listingModel.searchListings(searchQuery);

    // Filter listings based on selected tags
    if (searchQuery.tags.length > 0) {
      const filteredListings = listings.filter((listing) =>
        listing.tags.some((tag) => searchQuery.tags.includes(tag))
      );
      res.send(filteredListings);
    } else {
      res.send(listings);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});*/


  export default router; //allows other files to access the routes
