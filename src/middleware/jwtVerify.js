import jwt from "jsonwebtoken";
import { response } from "../res/response.js";

// verify token jwt
export const authenticationToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return response(401, { Success: false }, "Unauthorized", res)
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return response(403, { Success: false }, "Forbidden", res)
      }
        req.user = user
        next()
    })
}