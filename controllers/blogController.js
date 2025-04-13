import Blog from '../models/Blog.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Create a new blog post
export const createBlogPost = async (req, res) => {
    try {
        console.log("==== Incoming request to create blog ====");
        console.log("Headers:", req.headers);
        console.log("Cookies:", req.cookies);
        console.log("Body:", req.body);

        const token = req.cookies.token;
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized. Token not found in cookies." });
        }

        const decoded = jwt.verify(token, process.env.Token);
        console.log("Decoded token:", decoded);

        const userId = decoded.userId;
        const name = decoded.name;
        const email = decoded.email;
        const role = decoded.role || "user";

        const blog = new Blog({
            ...req.body,
            user: userId,
            name,
            email,
        });

        await blog.save();

        res.status(201).json({
            message: "Blog created successfully!",
            blog: {
                ...blog.toObject(),
                user: {
                    userId,
                    name,
                    email,
                    role
                },
            },
        });
    } catch (err) {
        console.error("Error creating blog:", err.message);
        res.status(400).json({ message: err.message });
    }
};



//Get all blogs
export const getAllBlogPosts = async (req, res) => {
    try {
        const blogs  = await Blog.find().populate('user','username email');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


export const getAllBlogById= async (req, res) => {
    try {
        const blogs  = await Blog.findById(id).populate('user','name  email');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}