import db from '../database/database.js'; //allows the model to access the db client
import { ObjectId } from 'mongodb';
const queryCollection = await db.collection('QueryPosts'); //name of collection
const realPostCollection = await db.collection('Posts');

/**
 * Retrieves all listings from the specified collection.
 *
 * @returns {Array} - An array containing all listings.
 */
async function getAllListings() {
    let result = await queryCollection.find({}).toArray();
    return result;
}

/**
 * Retrieves listings for a specific page number from the specified collection.
 *
 * @param {number} pageNumber - The page number for which listings should be retrieved.
 * @returns {Array} - An array containing listings for the specified page.
 */
async function getPageListings(pageNumber) {
    let result = await queryCollection.find({}).skip((pageNumber - 1) * 9).limit(9).toArray();
    return result;
  }

/**
 * Retrieves a listing based on the provided query from the specified collection.
 *
 * @param {Object} query - The query to search for a specific listing.
 * @returns {Object|string} - The matching listing or a message indicating that the listing was not found.
 */
async function getListing(query) {
    let result = await queryCollection.findOne(query);
    if(!result) {return "Listing not found";}
    else {return result;}
}

/**
 * Retrieves a listing based on the provided post ID from the specified collection.
 *
 * @param {Object} postID - The post ID to search for a specific listing.
 * @returns {Object|string} - The matching listing or a message indicating that the listing was not found.
 */
async function getByPostID(postID) {
    let result = await queryCollection.findOne(postID);
    if(!result) {return "Listing not found";}
    else {return result;}
}

/**
 * Creates a new listing in the specified collection.
 *
 * @param {Object} newListing - The new listing to be created.
 * @returns {Object} - The result of the insertion operation.
 */
async function create(newListing) {
    let result = await queryCollection.insertOne(newListing);
    return result;
}

/**
 * Retrieves listings for a specific user based on the provided query from the specified collection.
 *
 * @param {Object} query - The query to search for user-specific listings.
 * @returns {Array} - An array containing listings for the specified user.
 */
async function getUserListings(query) {
    let result = await queryCollection.find({postOwner: query}).toArray();
    return result;
}

/**
 * Deletes a listing based on the provided query from the specified collection.
 *
 * @param {Object} query - The query to search for a specific listing to be deleted.
 * @returns {Object} - The result of the deletion operation.
 */
async function deleteListing(query) {
    let result = await queryCollection.deleteOne(query);
    return result;
}

/**
 * Updates a listing based on the provided query and updates from the specified collection.
 *
 * @param {Object} query - The query to search for a specific listing to be updated.
 * @param {Object} updates - The updates to be applied to the listing.
 * @returns {Object} - The result of the update operation.
 */
async function updateListing(query, updates) {
    let result = await queryCollection.updateOne(query, updates);
    return result;
  }
  
export default {
    getAllListings,
    getListing,
    getPageListings,
    getByPostID,
    create,
    getUserListings,
    deleteListing,
    updateListing
};