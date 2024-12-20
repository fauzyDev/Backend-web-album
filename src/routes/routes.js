import express from "express"
import { doubleCsrfProtection, generateToken } from "../middleware/csrfProtection.js"
import { authenticationToken } from "../middleware/jwtVerify.js"
import { login, fileUpload, getData, deleteData, updateData } from "../controller/controller.js"
import { upload } from "../controller/uploadFile.js"
import { response } from "../res/response.js"

export const router = express.Router()

// route get csrf token
router.get('/api/v1/csrf', (req, res) => {
    const csrfToken = generateToken(req, res)
    res.json({ csrfToken }) // route csrf token
})

// route post login
router.post('/api/v1/login', doubleCsrfProtection, login);
// route get dashboard
router.get('/pages/v1/dashboard', authenticationToken);
// route get check admin login
router.get('/api/v1/check-login', authenticationToken, (req, res) => {
    response(200, { Success: true }, "Successful", res)
});

// route post logout
router.post('/api/v1/logout', (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    res.clearCookie('psifi.x-csrf-token', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
    return response(200, { Success: false }, "Logged out successfully", res);
});

// route get data 
router.get('/api/data', getData)
// route post upload file
router.post('/api/v1/upload', upload.single('file'), doubleCsrfProtection, fileUpload);
// route patch update file
router.patch('/api/data', upload.single('file'), doubleCsrfProtection, updateData);
// route delete file
router.delete('/api/data', doubleCsrfProtection, deleteData);