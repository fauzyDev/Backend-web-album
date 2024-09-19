import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/error.js"
import { router } from "./routes/routes.js"

dotenv.config();

const app = express();
const port = 5000

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: "API V1 Ready"
  })
})

app.use('/', router)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Berjalan pada port ${port}`)
})
