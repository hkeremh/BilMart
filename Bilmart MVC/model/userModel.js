import db from '../database/database.js'; //allows the model to access the db client

async function getUser(id) {
  let collection = await db.collection('Users'); //name of collection
  let query = {_id: id};
  let result = await collection.findOne(query);
  if(!result) {return "User not found";}
  else {return result;}
}

async function login(email, password){
    let collection = await db.collection("Users");
    let results = await collection.find({}).toArray();
    let user = await results.find((u) => (u.email === email)&&(u.password === password));
    if(!user) return "User not found";
    else return user;
}

async function signup(newDocument){
    let collection = await db.collection("Users");
    let result = await collection.insertOne(newDocument);
    return result;
}

//all methods that need to be used by other files (controller) go in here to export.
export default {
    getUser,
    login,
    signup
};