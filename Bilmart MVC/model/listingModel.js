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

/**
 * Retrieves a single listing based on the provided query.
 *
 * @param {Object} query - The MongoDB query object.
 * @returns {Object|string} - The listing if found, or "Listing not found" if not found.
 */
async function getListing(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.findOne(query);
  if(!result) {return "Listing not found";}
  else {return result;}
}

/**
 * Retrieves all listings for a specific user based on the provided query.
 *
 * @param {Object} query - The MongoDB query object for the user.
 * @returns {Array} - An array of listings for the specified user.
 */
async function getUserListings(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({postOwner: query}).toArray();
  return result;
}

/**
 * Retrieves all listings in the collection.
 *
 * @returns {Array} - An array containing all listings in the collection.
 */
async function getAllListings() {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({}).toArray();
  return result;
}

 /* async function getAllTags() {
  let collection = await db.collection('Tags'); //name of collection
  let result = await collection.find({}).toArray();
  return result;
}  */
/* async function getAllTags() {
  let collection = await db.collection('Tags'); //name of collection
  let result = await collection.distinct('name');
  return result;
}  */

/**
 * Retrieves all tags from the "Tags" collection.
 *
 * @returns {Array} - An array containing all tags in the "Tags" collection.
 */
async function getAllTags() {
  let collection = await db.collection('Tags'); //name of collection
  let collection2 = await db.collection('Posts'); //name of collection
  let result2 = await collection2.distinct('tags');
  let result = await collection.find({}).toArray();
  return result;
}

/**
 * Retrieves all tags associated with posts from the "Posts" collection.
 *
 * @returns {Array} - An array containing all distinct tags associated with posts.
 */
async function getPostAllTags() {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.distinct('tags');
  return result;
}

/**
 * Retrieves a page of listings from the "Posts" collection based on the provided page number.
 *
 * @param {number} pageNumber - The page number.
 * @returns {Array} - An array containing listings for the specified page.
 */
async function getPageListings(pageNumber) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.find({}).skip((pageNumber - 1) * 3).limit(3).toArray();
  return result;
}

/**
 * Posts a new listing to the "Posts" collection.
 *
 * @param {Object} newListing - The new listing object to be inserted.
 * @returns {Object} - The result of the insert operation.
 */
async function postListing(newListing) {
    let collection = await db.collection('Posts'); //name of collection
    let result = await collection.insertOne(newListing);
    return result;
}

/**
 * Updates a listing in the "Posts" collection based on the provided query and updates.
 *
 * @param {Object} query - The query to find the listing to be updated.
 * @param {Object} updates - The updates to be applied to the listing.
 * @returns {Object} - The result of the update operation.
 */
async function updateListing(query, updates) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.updateOne(query, updates);
  return result;
}

/**
 * Deletes a listing from the "Posts" collection based on the provided query.
 *
 * @param {Object} query - The query to find the listing to be deleted.
 * @returns {Object} - The result of the delete operation.
 */
async function deleteListing(query) {
  let collection = await db.collection('Posts'); //name of collection
  let result = await collection.deleteOne(query);
  return result;
}

/**
 * Updates the wishlist of a listing in the "Posts" collection based on the provided ID and updates.
 *
 * @param {string} id - The ID of the listing to update the wishlist.
 * @param {Object} updates - The updates to be applied to the listing's wishlist.
 * @returns {Object} - The result of the update operation.
 */
async function addToWishlist(id, updates) {
  let collection = await db.collection('Posts'); //name of collection
  let query = {_id: new ObjectId(id)};
  let result = await collection.updateOne(query, updates);
  return result;
}

/*
{
	text : "searchtext",
	type : "category",
	tags : ["tag1","tag2"],
	availability : ["Available",]
}
*/

/**
 * Searches for listings in the "QueryPosts" collection based on the provided search query.
 *
 * @param {Object} searchQuery - The search query containing parameters such as text, type, tags, availability, orderBy, and pageNumber.
 * @returns {Array} - An array of listings that match the search criteria.
 */
async function searchListings(searchQuery) {
  let collection = await db.collection('QueryPosts'); //name of collection
  let isPrice = searchQuery.orderBy.includes("price");
  let isLow =  searchQuery.orderBy.includes("Low");

  /* let tagCondition = Array.isArray(searchQuery.tags)
  ? { "tags": { $in: searchQuery.tags.map(tag => new RegExp(tag, 'i')) } }
  : { "tags": { $regex: searchQuery.tags, $options: "i" } }; */

  /* let tagCondition = Array.isArray(searchQuery.tags)
  ? { "tags": { $in: searchQuery.tags.map(tag => new RegExp(tag, 'i')) } }
  : { "tags": { $regex: new RegExp(searchQuery.tags, 'i') } };   */
  
  ////////////////////works below
  /* let searchTextRegex = new RegExp(searchQuery.text, 'i');

  let result = await collection.find({
    "$and": [
      { "type": searchQuery.type.length > 0 ? { $in: searchQuery.type } : {$exists: true} },
      {
        "$or": [
          { "title": { $regex: searchTextRegex } },
          { "description": { $regex: searchTextRegex } },
          { "tags": { $in: [searchQuery.text] } }, // check if the search text is in any tag
          { "tags": { $elemMatch: { $regex: searchTextRegex } } } // check if any tag matches the search text
        ]
      }
    ] */
    //////////////////////////////
    const inputTagsArray = searchQuery.text.split(',').map(tag => tag.trim());

// Use this array in your search functionality
const result = await collection.find({
  "$and": [
    { "type": searchQuery.type.length > 0 ? { $in: searchQuery.type  } : {$exists: true} },
    { 
      "$or": [
        { "title": { $regex: searchQuery.text, $options: "i" } },
        { "description": { $regex: searchQuery.text, $options: "i" } },
        { "tags": { $elemMatch: { $in: inputTagsArray } } } // Check if any of the input tags are in the post's tags
      ]
    }
  ]
  }).sort(isPrice ? {"typeSpecific.price": isLow ? 1 : -1 } : {"postDate": isLow ? 1 : -1}).skip((searchQuery.pageNumber - 1) * 9).limit(9).toArray();

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
    deleteListing,
    searchListings,
    getAllTags,
    getPostAllTags
};