import express from "express"
import dotenv from "dotenv"
dotenv.config()
import { connectDB } from "./config/db.js";
import globalErrorHandler from "./controllers/error.controller.js"
import userRoutes from "./routes/user.routes.js";
import formRoutes from "./routes/question.routes.js"

const app = express()

connectDB();
app.use(express.json())
app.use(express.urlencoded({extended:false}))



app.use('/users', userRoutes)
app.use('/forms', formRoutes)

app.all("*", (req, res, next) => {
    res.status(404).json({
      status: "fail",
      message: `can't find ${req.originalUrl} on this server!!!`,
    });
})

app.use(globalErrorHandler)


const port = 5000;

app.listen(port, () => console.log(`server is ruunnig on port ${port}`))