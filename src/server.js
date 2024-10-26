import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookie from "cookie"
import helmet from "helmet"
import { errorHandler } from "./middleware/error.js"
import { router } from "./routes/routes.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'https://api-web-album.vercel.app'],  
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-csrf-token']
  })) // cors domain
app.options('*', cors());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      objectSrc: ["'none'"]
    }
  }
}))

app.use(express.json());
app.use(express.urlencoded({ extended:  true }));
app.use((req, res, next) => {
  req.cookies = cookie.parse(req.headers.cookie || '');
  next();
});

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
