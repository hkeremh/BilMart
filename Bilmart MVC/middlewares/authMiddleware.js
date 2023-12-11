import userModel from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import jwt from "jsonwebtoken";
/**
 * @param {*} req a request
 * @returns true if req.body contains a valid userToken, false otherwise
 */
const validCookie = (req) => {
}

const userVerification = (req, res) => {
  const token = req.cookies.userToken
  console.log(req.cookies)
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

export default userVerification;