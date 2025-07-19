import dotenv  from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from 'cors'
import { dbConnection } from "./config/db.js";
import userRoutes from './routes/userRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import courseRoutes from "./routes/courseRoutes.js"
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from "./routes/checkoutRoutes.js";
import purchaseRoutes from './routes/purchaseRoutes.js'
import courseProgressRoutes from './routes/courseProgressRoutes.js'
import certificateRoutes from './routes/certificateRoutes.js'

dotenv.config();

dbConnection()
const app=express()



const allowedOrigins = ['http://localhost:3000']; 

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, 
  })
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use(morgan("dev"))


app.use("/api/v1/checkout", checkoutRoutes);

app.use("/api/v1",userRoutes)
app.use("/api/v1",contactRoutes)
app.use("/api/v1/courses",courseRoutes)
app.use("/api/v1/cart",cartRoutes)
app.use("/api/v1/purchases",purchaseRoutes)
app.use("/api/v1/access",courseProgressRoutes)
app.use("/api/v1/access",courseProgressRoutes)
app.use("/api/v1/certificates",certificateRoutes)


export default app