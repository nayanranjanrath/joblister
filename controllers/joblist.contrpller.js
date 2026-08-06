import prisma from "../utility/prisma";
import {extractToken} from "../utility/jwt.js"
import { uploadtocloudinar } from "../utility/cloudinary.js";
export const addjob = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const {description,companyname,location,type} = req.body;
        if (!description || !companyname || !location || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const post = req.file?.path;
        if (!post) {
            return res.status(400).json({ message: "Post a image file about your company" });
        }
        const uploadedpost = await uploadtocloudinar(post);
        const job = await prisma.job.create({
            description,
            companyname,
            location,
            type,
            post: uploadedpost.secure_url,
            expaireAT: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            postedby: { connect: { id: userId } },
        });
        res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const applyjob = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const  jobId  = req.body.jobId ;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const job = await prisma.job.findUnique({ where: { id: jobId } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        const application = await prisma.application.create({
            data: {
                job: { connect: { id: jobId } },
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const aproveapplicant = async (req, res) => {
    try {  
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const  applicationId  = req.body.applicationId ;
        if (!applicationId) {
            return res.status(400).json({ message: "Application ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const application = await prisma.application.findUnique({ where: { id: applicationId } });
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        const job = await prisma.job.findUnique({ where: { id: application.jobId },
        include: { postedby: true } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.postedby.id !== userId) {
            return res.status(403).json({ message: "You are not authorized to approve this applicant" });
        }
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status: "approved" },
        });
        res.status(200).json({ message: "Applicant approved successfully", updatedApplication });
    }
        
        
     catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

const addrequirements = async (req, res) => {
    try {
        
    } catch (error) {
          console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}