import express from "express"
import mongoose from "mongoose"
import cookieparser from "cookie-parser"
import userRouter from "./router/User-router.js";
import bookRouter from "./router/Book-router.js";
import dotenv from "dotenv"

dotenv.config()
const app = express();

app.use(express.json())
app.use(cookieparser())


mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("mongoDB is connected")).catch((err)=> console.log(err))

app.use("/POST/api", userRouter)
app.use("/GET/api", bookRouter)
app.use("/POST/api",bookRouter)
app.use("/PUT/api",bookRouter)
app.use("/DELETE/api", bookRouter)

app.listen(5000, ()=>{
    console.log("server is connected to 5000")
})