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
import { ObjectId } from 'mongodb';

async function getListing(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.findOne(query);
  if(!result) {return "Listing not found";}
  else {return result;}
}

async function getUserListings(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({postOwner: query}).toArray();
  return result;
}

async function getAllListings() {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({}).toArray();
  return result;
}

async function getPageListings(pageNumber) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({}).skip((pageNumber - 1) * 3).limit(3).toArray();
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
async function addToWishlist(id, updates) {
  let collection = await db.collection('Posts'); //name of collection
  let query = {_id: new ObjectId(id)};
  let result = await collection.updateOne(query, updates);
  return result;
}

//all methods that need to be used by other files (controller) go in here to export.
export default {
    getAllListings,
    getPageListings,
    getListing,
    getUserListings,
    postListing,
    updateListing,
    deleteListing
};