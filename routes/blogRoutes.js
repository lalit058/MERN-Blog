import express from "express";
import { createBlogPost, getAllBlogPosts ,getAllBlogById} from "../controllers/blogController.js";

import { verifyToken, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/create',verifyToken,authorize["admin"], createBlogPost);
// router.post('/createblog',createBlogpost);

router.get('/get',getAllBlogPosts);//

// router.get('/get/:id',getAllBlogById);
router.get('/blogs/:id',getAllBlogById);


export default router;