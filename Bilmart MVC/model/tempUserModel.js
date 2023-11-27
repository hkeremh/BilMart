import { ObjectId } from 'mongodb';
import db from '../database/database.js';   //allows the model to access the db client
import bcrypt from "bcrypt";                //encrypt data
const collection = await db.collection('TempUsers')
async function getUserByUserName(username) {
    let query = {username: username};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByUserId(id) {
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}
async function remove(username) {
    collection.deleteOne({username: username});
}
async function create(query) {
    let result = await collection.insertOne(query);
    console.log(result);
    return result;
}
export default {
    getUserByUserName,
    getUserByUserId,
    remove,
    create
}