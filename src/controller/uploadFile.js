import multer from "multer";

// configuration multer
const storage = multer.memoryStorage()
export const upload = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }
})