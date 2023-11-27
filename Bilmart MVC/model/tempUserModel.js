import { ObjectId } from 'mongodb';
import db from '../database/database.js';   //allows the model to access the db client
import bcrypt from "bcrypt";                //encrypt data
const collection = await db.collection('TempUsers')
async function getUserByUserName(username) {
    let query = {username: username};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByEmail(email) {
    let query = {email: email};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByUserId(id) {
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}
async function remove(id) {
    collection.deleteOne({_id: new ObjectId(id)});
}
async function create(query) {
    collection.insertOne(query);
}
export default {
    getUserByUserName,
    getUserByEmail,
    getUserByUserId,
    remove,
    create
}