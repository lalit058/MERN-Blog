import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

//routes

app.use('/api', userRoutes);
app.use('/api/blog',blogRoutes);
app.use('/api',authRoutes);



// start server
const PROT = 8080;

app.listen(PROT, () => {
    console.log(`Server is running on port ${PROT}`);
});