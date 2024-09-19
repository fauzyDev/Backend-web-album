import express from "express"
import { authenticationToken } from "../middleware/jwtVerify.js"
import { login,  } from "../controller/controller.js"
import { response } from "../res/response.js"

export const router = express.Router()

router.post('/api/login', login)
router.get('/pages/dashboard', authenticationToken)
router.get('/api/check-login', authenticationToken, (req, res) => {
    response(200, { Authenticated: true }, "Authenticated", res)
});

