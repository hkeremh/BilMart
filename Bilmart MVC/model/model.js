/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 * 
 *
 *
 * This is where we will access the db. So, all update,add,search, etc. operations will be done through here.
 * Similarly how a /login (explained in controller/controller.js) will have a loginController, we can also have a loginModel (I am not 100% sure if this would be standard practice though).
 * 
 */

const { getClient } = require('../database/database.js'); //allows the model to access the db client

async function getAllListings() {

  const client = getClient(); //calling client instance
  const db = client.db('sample_airbnb'); //name of database
  const collection = db.collection('listingsAndReviews'); //name of collection
  return collection.find().toArray();
  
}


//all methods that need to be used by other files (controller) go in here to export.
module.exports = {
    getAllListings
};