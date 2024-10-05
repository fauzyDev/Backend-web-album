import jwt from "jsonwebtoken";
import prisma from "../libs/prisma.js";
import { response } from "../res/response.js";

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const data = await prisma.User.findFirst({
            where: { username },
            cacheStrategy: { ttl: 60 },
        })

        if (!data) {
           return response(401, { Authenticated: false }, "Username dan password tidak ditemukan", res)
        } 

        if (password !== data.password) {
            return response(401, { Authenticated: false }, "Password salah", res)
        }
            // generate jwt token
            try {
                const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET, {
                algorithm: 'HS512',
                expiresIn: '1h'
                })
            // send token jwt to cookie    
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 })
            response(200, { Authenticated: true }, "Successful", res)
            } catch (error) {
                return response(500, null, "Fail", res)
            }

        } catch (error) {
            next(error)
        }
    }

export const uploadFile = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(error)
    }
}

// export const deleteMahasiswa = async (req, res, next) => {
//     try {
//         const { nim } = req.body
//         const mahasiswa = await prisma.Mahasiswa.delete({
//             where: { nim: nim }
//         })
//         response(200, mahasiswa, "Data berhasil di hapus", res)
//     } catch (error) {
//         next(error)
//     }
// }
