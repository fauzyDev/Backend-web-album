import express from "express"
import { doubleCsrfProtection, generateToken } from "../middleware/csrfProtection.js"
import { authenticationToken } from "../middleware/jwtVerify.js"
import { login } from "../controller/controller.js"
import { response } from "../res/response.js"

export const router = express.Router()

router.post('/api/v1/login', doubleCsrfProtection, login) // route login
router.get('/pages/v1/dashboard', authenticationToken) // route dashboard
router.get('/api/v1/check-login', authenticationToken, (req, res) => {
    response(200, { Authenticated: true }, "Successful", res) // route chech user login
});

router.post('/api/v1/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' })
    return response(200, { Authenticated: false }, "Logged out successfully", res) // route logout
});

router.get('/api/v1/csrf', (req, res) => {
    const csrfToken = generateToken(req, res)
    res.json({ csrfToken })
})

