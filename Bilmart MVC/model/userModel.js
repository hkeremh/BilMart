import { ObjectId } from 'mongodb';
import db from '../database/database.js'; //allows the model to access the db client

async function getUser(id) {
    let collection = await db.collection('Users'); //name of collection
    let query = {_id: new ObjectId(id)};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByEmail(email) {
    let collection = await db.collection('Users'); //name of collection
    let query = {email: email};
    let result = await collection.findOne(query);
    return result;
}
async function getUserByUserName(username) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.findOne(query);
    return result;
}
async function editProfile(username, updates) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.updateOne(query, updates);
    return result;
}
async function addToWishlist(username, updates) {
    let collection = await db.collection('Users'); //name of collection
    let query = {username: username};
    let result = await collection.updateOne(query, updates);
    return result;
}
async function login(email, password){
    let collection = await db.collection("Users");
    let results = await collection.find({}).toArray();
    let user = await results.find((u) => (u.email === email)&&(u.password === password));
    if(!user) return "User not found";
    else return user;
}

async function create(newDocument){
    let collection = await db.collection("Users");
    console.log(user)
    let result = await collection.insertOne(user.toJSON());
    return result;
}

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
    remove
};