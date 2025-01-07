import jwt from "jsonwebtoken";
import prisma from "../libs/prisma.js";
import { supabase } from "../config/supabase.js"
import { response } from "../res/response.js";

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body
        const data = await prisma.User.findFirst({
            where: { username },
            cacheStrategy: { ttl: 20, swr: 40 },
        })

        if (!data) {
           return response(401, { Success: false }, "Username dan password tidak ditemukan", res)
        } 

        if (password !== data.password) {
            return response(401, { Success: false }, "Password salah", res)
        }

        // generate jwt token
        const token = jwt.sign({ userId: data.id }, process.env.JWT_SECRET, {
            algorithm: 'HS512',
            expiresIn: '1h'
        })
            
        // send token jwt to cookie    
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict', maxAge: 3600000 })
        response(200, { Success: true }, "Successful", res)
            
        } catch (error) {
            console.error("Error", error)
            next(error)
        }
    }

export const fileUpload = async (req, res, next) => {
        const { judul, description } = req.body;
        const file = req.file;
    
        if (!judul || !description || !file) {
            return response(400, { Success: false }, "Harap isi judul dan deskripsi serta upload foto atau video", res)
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
            return response(500, { Success: false }, "Gagal mengunggah file", res)
        }
    
        const { data: dataUrl } = supabase.storage
            .from('test')
            .getPublicUrl(fileName);
            
        const publicUrl = dataUrl.publicUrl
        await prisma.File.create({
            data: { 
                judul, 
                description,
                url: publicUrl
            },
            cacheStrategy: { ttl: 20, swr: 40 },
        })
        response(201, { Success: true }, "Sucessful", res)

        } catch (error) {
            console.error("Error", error)
            next(error)
        }
    }

export const getData = async (req, res, next) => {
    try {
        const data = await prisma.File.findMany({
            select: {
                id: true,
                judul: true,
                description: true,
                url: true
            },
            cacheStrategy: { ttl: 20, swr: 40 },
        })
        response(200, data, "Data berhasil diambil", res)

        } catch (error) {
            console.error("Error", error)
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
        response(200, { Success: true }, "Data berhasil di hapus", res)

        const fileUrl = data.url
        const fileName = fileUrl.split('/storage/v1/object/public/test/')[1].split('?')[0];
        const { error } = await supabase
        .storage
        .from('test')
        .remove([fileName])

        if (error) {
            return response(500, { Success: false }, "Gagal menghapus data", res)
        }
    } catch (error) {
        console.error("Error", error)
        next(error)
    }
}

export const updateData = async (req, res, next) => {
    const { id, judul, description, url } = req.body
    const file = req.file

    const replaceFileName = (fileName) => {
        return fileName.replace(/[^a-zA-Z0-9_\-\.]/g, '') // replace nama file yang memiliki karakter unik
    }

    try {
        const update = {};
        if (judul) update.judul = judul;
        if (description) update.description = description;
        if (url) update.url = url;

        if (file) {
            const fileNameOriginal = file.originalname
            const existingData = await prisma.File.findUnique({ where: { id: parseInt(id) } })
            const existingFileName = existingData.url.split('/').pop()
            const sanitizedFileName  = `${Date.now()}-${replaceFileName(fileNameOriginal)}`

            const { error: deleteError } = await supabase.storage
                .from('test')
                .remove([existingFileName]);

            if (deleteError) {
                console.error("Error menghapus file lama:", deleteError);
            return response(500, { Success: false }, "Gagal menghapus file", res);
            }

            const { data, error  } = await supabase.storage
                .from('test')
                .upload(sanitizedFileName, file.buffer, {
                    cacheControl: 0
                })

            if (error) {
                console.error("Error Supabase:", error);
                return response(500, { Success: false }, "Gagal mengunggah file", res)
            }
            const { data: dataUrl } = supabase.storage
               .from('test')
               .getPublicUrl(sanitizedFileName);

            update.url = dataUrl.publicUrl
        }

        const result = await prisma.File.update({
            where: { id: parseInt(id) },
            data: update,
            select: {
                id: true,
                judul:  true,
                description: true,
                url: true
            },
            cacheStrategy: { ttl: 20, swr: 40 },
        })
            response(200, result, "Data berhail diupdate", res)
        
    } catch (error) {
        next(error)
    }
}

export const filterFile = async (req, res, next) => {
    try {
        const file = await prisma.file.findMany({
            where: {
              OR: [
                { url: { endsWith: '.jpg' } },
                { url: { endsWith: '.png' } },
                { url: { endsWith: '.jpeg' } },
              ],
            },
            select: {
              id: true,
              judul: true,
              description: true,
              url: true,
            },
          });
          response(200, file, "succes", res)
    } catch (error) {
        next(error)
    }
  };

  