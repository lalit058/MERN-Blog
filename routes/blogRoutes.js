import express from "express";
import { createBlogPost, getAllBlogPosts, getAllBlogById } from "../controllers/blogController.js";
import { verifyToken, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create blog post (admin only)
router.post('/create', verifyToken, authorize("admin"), createBlogPost);

// Get all blog posts
router.get('/get', getAllBlogPosts);

// Get blog post by ID
router.get('/blogs/:id', getAllBlogById);

export default router;
