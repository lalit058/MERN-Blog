import express from "express";
import { registerUser,loginUser} from "../controllers/authController.js";

const router = express.Router();

//Route for signing up a new user
router.post('/signup', registerUser);

//Route for logging in a user
router.post('/login',loginUser);

//mongodb://localhost:27017/


export default router;
