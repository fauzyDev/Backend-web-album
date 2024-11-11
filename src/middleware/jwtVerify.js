import jwt from "jsonwebtoken";
import { response } from "../res/response.js";

// token jwt request cookie
export const authenticationToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return response(401, { Success: false }, "Unauthorized", res)
    }

    // token jwt verify
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return response(403, { Success: false }, "Forbidden", res)
      }
        req.user = user
        next()
    })
}