import jwt from "jsonwebtoken";
import { response } from "../res/response.js";

export const authenticationToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return response(401, { Authenticated: false }, "Unauthorized", res)
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return response(403, { Authenticated: false }, "Forbidden", res)
      }
        req.user = user
        next()
    })
}