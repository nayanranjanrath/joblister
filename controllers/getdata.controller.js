import prisma from "../utility/prisma";
import { extractToken } from "../utility/extracttoken.js";


export const showprofile=async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const user = await prisma.user.findUnique({
            where: { id: id },
           
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                avatar: true,
                description: true,
                dob: true,
                education: {
                    select: {
                        id: true,
                        degree: true,
                        institute: true,
                        yearofcomplition: true,
                    },
                },
                expirience: {
                    select: {
                        id: true,
                        start: true,
                        end: true,
                        details: true,
                        company: true,
                    },
                },
                skills: {
                    select: {
                        skill: {
                            select: {
                                id: true,
                                skill: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(user);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const showeducationdetails =async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const educationDetails = await prisma.educationdetails.findMany({
            where: { userId: id },
            select: {
                id: true,
                degree: true,
                college: true,
                yearofcomplition: true,
                proof: true,
            },
        });
        if (!educationDetails) {
            return res.status(404).json({ message: "Education details not found" });
        }
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(educationDetails);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const showexpiriencedetails =async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const experienceDetails = await prisma.expirience.findMany({
            where: { userId: id },
            select: {
                id: true,
                start: true,
                end: true,
                details: true,
                company: true,
                proof: true,
            },
        });
        if (!experienceDetails) {
            return res.status(404).json({ message: "Experience details not found" });
        }
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(experienceDetails);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const showappliedjobs =async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const appliedJobs = await prisma.application.findMany({
            where: { userId: userId },
            include: {
                job: true,}
                
        });
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(appliedJobs);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const showpostedjobs =async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const postedJobs = await prisma.jobs.findMany({
            where: { postedbyId: userId },
            include: {
                requirements: true,
            }
        });
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(postedJobs);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const showapplicant = async(req,res)=>{
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const userid = extractToken(token);
        if (!userid) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const applicants = await prisma.application.findMany({
            where: { jobId: jobId },
            select: {
                   id: true,
                name: true,
                email: true,
                username: true,
                avatar: true,
            }
        });
        res.set("Cache-Control", "public, max-age=300");
        return res.status(200).json(applicants);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

