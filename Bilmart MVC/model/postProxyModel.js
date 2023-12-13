import db from '../database/database.js'; //allows the model to access the db client
import { ObjectId } from 'mongodb';
const queryCollection = await db.collection('QueryPosts'); //name of collection
const realPostCollection = await db.collection('Posts');

async function getAllListings() {
    let result = await queryCollection.find({}).toArray();
    return result;
}
async function getListing(query) {
    const result = await queryCollection.findOne(query);
    return result;
}
async function getByPostID(postID) {
    const result = await queryCollection.findOne(query);
    return result;
}
async function create(newListing) {

    let result = await queryCollection.insertOne(newListing);
    return result;
}
async function getUserListings(query) {
    let result = await queryCollection.find({postOwner: query}).toArray();
    return result;
}
async function deleteListing(query) {
let result = await queryCollection.deleteOne(query);
return result;
}
async function updateListing(query, updates) {
    let result = await queryCollection.updateOne(query, updates);
    return result;
  }
  
export default {
    getAllListings,
    getListing,
    getByPostID,
    create,
    getUserListings,
    deleteListing,
    updateListing
};