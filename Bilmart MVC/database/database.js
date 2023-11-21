
/**
 * IMPORTANT: Please don't delete or change this file for now, this is a good example/referance.
 *
 *
 * 
 * This is where we initialize the database and connect to one with a link.
 */
import { MongoClient } from "mongodb";

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let conn;
try {
  console.log("Connecting to MongoDB Atlas...");
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("BilMartDatabase");

export default db;
