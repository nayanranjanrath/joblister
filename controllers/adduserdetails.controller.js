import prisma from "../utility/prisma";
import { extractToken } from "../utility/jwt.js";
import { uploadtocloudinar } from "../utility/cloudinary.js";


export const addeducationdetails = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        const {start,end,details,company}=req.body;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if(!start || !end || !details || !company){
            return res.status(400).json({ message: "All fields are required" });
        }
        const proof = req.file?.path;
        if (!proof) {
            return res.status(400).json({ message: "Upload your proof" });
        }
    
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const uploadedProof = await uploadtocloudinar(proof);
        if (!uploadedProof) {
            return res.status(500).json({ message: "Failed to upload proof" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const expirience = await prisma.expirience.create({
            data: {
                start,
                end,
                details,
                company,
                proof: uploadedProof,
                user: { connect: { id: userId } },
            },
        });
    
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

 export const addeducationdetails = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        const{degree,yearofcomplition,college}=req.body;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        if(!degree || !yearofcomplition || !college){
            return res.status(400).json({ message: "All fields are required" });
        }
        const proof = req.file?.path;
        if (!proof) {
            return res.status(400).json({ message: "Upload your proof" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const uploadedProof = await uploadtocloudinar(proof);
        if (!uploadedProof) {
            return res.status(500).json({ message: "Failed to upload proof" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const education = await prisma.educationdetails.create({
            data: {
                degree,
                yearofcomplition,
                college,
                proof: uploadedProof,
                user: { connect: { id: userId } },
            },
        });
        return res.status(201).json({ message: "Education details added successfully", education });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
 }

