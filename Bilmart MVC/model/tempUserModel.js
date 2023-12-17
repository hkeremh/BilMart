import { ObjectId } from 'mongodb';
import db from '../database/database.js';   //allows the model to access the db client
import bcrypt from "bcrypt";                //encrypt data
const collection = await db.collection('TempUsers')

/**
 * Retrieves a user based on the provided username from the specified collection.
 *
 * @param {string} username - The username to search for.
 * @returns {Object} - The user object matching the provided username.
 */
async function getUserByUserName(username) {
    let query = {username: username};
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
    let query = {email: email};
    let result = await collection.findOne(query);
    return result;
}

/**
 * Retrieves a user based on the provided user ID from the specified collection.
 *
 * @param {string} id - The user ID to search for.
 * @returns {Object} - The user object matching the provided user ID.
 */
async function getUserByUserId(id) {
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}

/**
 * Removes a user based on the provided user ID from the specified collection.
 *
 * @param {string} id - The user ID to be removed.
 */
async function remove(id) {
    await collection.deleteOne({_id: new ObjectId(id)});
}

/**
 * Creates a new user in the specified collection.
 *
 * @param {Object} query - The query representing the new user.
 */
async function create(query) {
    await collection.insertOne(query);
}
export default {
    getUserByUserName,
    getUserByEmail,
    getUserByUserId,
    remove,
    create
}