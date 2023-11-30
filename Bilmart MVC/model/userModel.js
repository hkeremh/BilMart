import db from '../database/database.js'; //allows the model to access the db client
import { ObjectId } from 'mongodb';
const collection = await db.collection('Users');

async function getUser(id) {
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}

async function getUserByEmail(email) {
    let query = {email: email};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByUserName(username) {
    let query = {username: username};
    let result = await collection.findOne(query);
    return result;
}

async function login(email, password){
    let results = await collection.find({}).toArray();
    let user = await results.find((u) => (u.email === email)&&(u.password === password));
    if(!user) return "User not found";
    else return user;
}

async function create(newDocument){
    let result = await collection.insertOne(newDocument);
    return result;
}

//all methods that need to be used by other files (controller) go in here to export.
export default {
    getUser,
    login,
    create,
    getUserByEmail,
    getUserByUserName
};