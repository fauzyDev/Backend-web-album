import express from "express"
import { createMahasiswa, getMahasiswa, updateMahasiswa, deleteMahasiswa } from "../controller/mahasiswaController.js"

export const router = express.Router()

router.post('/api/upload', createMahasiswa)
router.get('/api/data', getMahasiswa)
router.put('/api/update', updateMahasiswa)
router.delete('/api/delete', deleteMahasiswa)
