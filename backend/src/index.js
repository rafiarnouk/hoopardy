import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import { userRouter } from "./routes/users.js"
import dotenv from 'dotenv';
dotenv.config()

const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)

mongoose.connect(
    process.env.MONGO_DB_URL
)

app.listen(3001, () => console.log("server started"))