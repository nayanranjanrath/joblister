import prisma from "../utility/prisma";
import { extractToken } from "../utility/jwt.js";
import { uploadtocloudinar } from "../utility/cloudinary.js";

export const addpost = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { title, description, } = req.body;
        if (!title || !description || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const imagePaths = req.files?.map(file => file.path) || [];
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const uploadedImages = await Promise.all(
            imagePaths.map(path => uploadtocloudinar(path))
        );
        const imageUrls = uploadedImages.map(image => image.secure_url);
        const post = await prisma.post.create({
            data: {
                title,
                description,
                category,
                image: imageUrls,
                postedBy: { connect: { id: userId } },
            },
        });
        return res.status(201).json({ message: "Post created successfully", post });


    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const likepost = async(req, res) => {
    try {
        const token = req.cookies.accesstoken;

        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const postId = req.body.postId;
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const like = await prisma.like.create({
            data: {
                post: { connect: { id: postId } },
                user: { connect: { id: userId } },
            },
        });
        return res.status(201).json({ message: "Post liked successfully", like });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const likedalredyornot = async(req,res)=>{
    try {
          const token = req.cookies.accesstoken;

        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const postId = req.body.postId;
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const like = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId: postId,
                    userId: userId,
                },
            },
        })
        if(like){
            return res.status(200).json({ message: "Post liked already"  });
        }
        return res.status(200).json({ message: "Post not liked"  });
    } catch (error) {
        consople.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const commentapost = async(req, res) => {
    try {
        const token = req.cookies.accesstoken;

        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const postId = req.body.postId;
        const comment = req.body.comment;
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const savedcomment = await prisma.comment.create({
            data: {
                post: { connect: { id: postId } },
                user: { connect: { id: userId } },
                comment: comment,
            },
        });
        return res.status(201).json({ message: "Comment created successfully", comment });
    }
    catch{
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

