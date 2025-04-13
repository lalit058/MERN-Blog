import express from "express";
import { register,loginuser} from "../controllers/authController.js";

const router = express.Router();

//Route for signing up a new user
router.post('/signup', register);

//Route for logging in a user
router.post('/login',loginuser);

//mongodb://localhost:27017/



export default router;
