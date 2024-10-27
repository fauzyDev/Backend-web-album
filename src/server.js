import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import { errorHandler } from "./middleware/error.js"
import { router } from "./routes/routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"]
    }
  }
}))

app.use(cors({ origin: ['https://web-album-cyan.vercel.app'],  
    credentials: true, })) // cors domain

app.use(express.json());
app.use(express.urlencoded({ extended:  true }));
app.use(cookieParser())

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: "API V1 Ready"
  })
})

app.use(router) //routes
app.use(errorHandler) //error handler

app.listen(port, () => {
    console.log(`Berjalan pada port ${port}`)
})
