
/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * 
 * This is where we initialize the database and connect to one with a link.
 */


const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://dbTestAdmin:123Admin456@cluster0.oap3bzr.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

//connecting to db
async function connect() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
}

function getClient() {
    return client;
}
  
module.exports = {
    connect,
    getClient
}
