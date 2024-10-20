import jwt from "jsonwebtoken";
import prisma from "../libs/prisma.js";
import { supabase } from "../config/supabase.js"
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

export const fileUpload = async (req, res, next) => {
        const { judul, description } = req.body;
        const file = req.file;
    
        if (!judul || !description || !file) {
            return response(400, null, "Harap isi judul dan deskripsi serta upload foto atau video", res)
        }

        const replaceFileName = (fileName) => {
            return fileName.replace(/[^a-zA-Z0-9_\-\.]/g, '') // replace nama file yang memiliki karakter unik
        }
    
        try {
            const fileNameOriginal = file.originalname 
            const fileName = `${Date.now()}-${replaceFileName(fileNameOriginal)}`
    
            const { data, error } = await supabase.storage
                .from('test')
                .upload(fileName, file.buffer);
    
            if (error) {
            console.error("Error Supabase:", error);
            return response(500, false, "Gagal mengunggah file", res)
        }
    
        const { data: dataUrl } = supabase.storage
            .from('test')
            .getPublicUrl(fileName);
            
        const publicUrl = dataUrl.publicUrl
        await prisma.File.create({
            data: { judul, description, url: publicUrl }
        })
    
            response(201, true, "Sucessfull", res)
        } catch (error) {
            next(error)
        }
    }

export const getData = async (req, res, next) => {
    try {
        const data = await prisma.File.findMany({
            select: {
                judul: true,
                description: true,
                url: true
            }
        })
            response(200, data, "Data berhasil diambil", res)
        } catch (error) {
            next(error)
        }
    }

export const deleteData = async (req, res, next) => {
    try {
        const { id } = req.body
        const data = await prisma.File.delete({
            select: {
                id: true,
                url: true
            },
            where: { id: id }
        })
        response(200, { data: true }, "Data berhasil di hapus", res)

        const fileUrl = data.url
        const fileName = fileUrl.split('/storage/v1/object/public/test/')[1].split('?')[0];
        const { error } = await supabase
        .storage
        .from('test')
        .remove([fileName])

        if (error) {
            return response(500, "Gagal menghapus data", res)
        }
    } catch (error) {
        next(error)
    }
}