import userModel from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import jwt from "jsonwebtoken";
import axios from "axios";

/**
 * Verifies the user token stored in cookies and returns the verification status.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} - JSON object containing the verification status.
 */
const userVerification = (req, res) => {
  const token = req.cookies.userToken
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.USER_TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await userModel.getUser(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
};

/**
 * @param {*} req a request
 * @returns data that contains data.status and data.user if cookie is valid 
 */
const validCookie = async (req) => {
  const { data } = await axios.post(
    "http://localhost:4000/user/", {},
    {
      headers: {
          Cookie: "userToken=" + req.cookies.userToken + ";"
      }
    }
    
  );
  return data
}

export default {userVerification, validCookie};