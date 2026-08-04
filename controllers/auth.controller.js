import prisma from "../utility/prisma.js"

import {uploadtocloudinar} from "../utility/cloudinari.js"
import { hashPassword, comparePassword } from "../utility/passoward.js";

export const adduser = async (req, res) => {
    try {
        const { username,fullname,dob,avatar,description, email, password } = req.body;
        if (!username || !email || !password||!description) {
            return res.status(400).json({ message: "Username, email, and password are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        if(username.length<3||username.length>10){
            return res.status(400).json({ message: "Username must be between 3 and 10 characters long" });
        }
        if(description.length<10||description.length>100){
            return res.status(400).json({ message: "Description must be between 10 and 100 characters long" });
        }
        if(fullname.length>20){
            return res.status(400).json({ message: "Fullname must be less than 20 characters long" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        let avatarlocalpath = req.file?.path;

        if (!avatarlocalpath) {
            avatarlocalpath = null
        }
        console.log("avatarlocalpath", avatarlocalpath)
        const avatarurl = await uploadtocloudinar(avatarlocalpath);
        console.log("avatarurl", avatarurl)
        const user = await prisma.user.create({
            data: {
                username,
                fullname,
                email,
                password: hashedPassword,
                avatar: avatarurl.url,
                description,
            }
        });
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginuser = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
         res.status(500).json({ message: "Internal server error" });
    }
}