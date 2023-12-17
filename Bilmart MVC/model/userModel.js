import { ObjectId } from 'mongodb';
import db from '../database/database.js'; //allows the model to access the db client
import User from "../model/Classes/UserClass.js"

/**
 * Retrieves a user based on the provided user ID from the specified collection.
 *
 * @param {string} id - The user ID to search for.
 * @returns {Object} - The user object matching the provided user ID.
 */
async function getUser(id) {
    let collection = await db.collection('Users'); //name of collection
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}

/**
 * Retrieves a user based on the provided email from the specified collection.
 *
 * @param {string} email - The email to search for.
 * @returns {Object} - The user object matching the provided email.
 */
async function getUserByEmail(email) {
    let collection = await db.collection('Users'); //name of collection
    let query = {email: email};
    let result = await collection.findOne(query);
    return result;
}

/**
 * Retrieves a user based on the provided username from the specified collection.
 *
 * @param {string} username - The username to search for.
 * @returns {Object} - The user object matching the provided username.
 */
async function getUserByUserName(username) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.findOne(query);
    return result;
}

/**
 * Edits the profile of a user based on the provided username in the specified collection.
 *
 * @param {string} username - The username of the user to edit.
 * @param {Object} updates - The updates to be applied to the user's profile.
 * @returns {Object} - The result of the update operation.
 */
async function editProfile(username, updates) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.updateOne(query, updates);
    return result;
}

/**
 * Adds updates to the wishlist of a user based on the provided username in the specified collection.
 *
 * @param {string} username - The username of the user to update the wishlist.
 * @param {Object} updates - The updates to be applied to the user's wishlist.
 * @returns {Object} - The result of the update operation.
 */
async function addToWishlist(username, updates) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.updateOne(query, updates);
    return result;
}

/**
 * Adds updates to the wishlist of a post based on the provided post ID in the specified collection.
 *
 * @param {string} postId - The ID of the post to update the wishlist.
 * @param {Object} updates - The updates to be applied to the post's wishlist.
 * @returns {Object} - The result of the update operation.
 */
async function addToPostWishlist(postId, updates) {
    let collection = await db.collection('Posts'); //name of collection
    let query = {_id: new ObjectId(postId)};
    let result = await collection.updateOne(query, updates);
    return result;
}

/**
 * Attempts to log in a user based on the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Object|string} - The user object if login is successful, or a string indicating "User not found" if unsuccessful.
 */
async function login(email, password){
    let collection = await db.collection("Users");
    let results = await collection.find({}).toArray();
    let user = await results.find((u) => (u.email === email)&&(u.password === password));
    if(!user) return "User not found";
    else return user;
}

/**
 * Creates a new user document in the specified collection.
 *
 * @param {Object} newDocument - The new user document to be created.
 * @returns {Object} - The result of the insert operation.
 */
async function create(newDocument){
    let collection = await db.collection("Users");
    const user = new User(newDocument)
    let result = await collection.insertOne(user.toJSON());
    return result;
}

/**
 * Removes a user based on the provided username from the specified collection.
 *
 * @param {string} username - The username of the user to be removed.
 */
async function remove(username) {
    let collection = await db.collection('Users'); //name of collection
    await collection.deleteOne({username: username});
}

//all methods that need to be used by other files (controller) go in here to export.
export default {
    getUser,
    login,
    create,
    getUserByEmail,
    getUserByUserName,
    editProfile,
    addToWishlist,
    addToPostWishlist,
    remove
};