/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 * 
 *
 *
 * This is where we will access the db. So, all update,add,search, etc. operations will be done through here.
 * Similarly how a /login (explained in controller/controller.js) will have a loginController, we can also have a loginModel (I am not 100% sure if this would be standard practice though).
 * 
 */

import db from '../database/database.js'; //allows the model to access the db client

async function getListing(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.findOne(query);
  if(!result) {return "Listing not found";}
  else {return result;}
}

async function getAllListings() {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({}).toArray();
  return result;
}

async function postListing(newListing) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.insertOne(newListing);
  return result;
}

async function updateListing(query, updates) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.updateOne(query, updates);
  return result;
}

async function deleteListing(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.deleteOne(query);
  return result;
}

//all methods that need to be used by other files (controller) go in here to export.
export default {
    getAllListings,
    getListing,
    postListing,
    updateListing,
    deleteListing
};