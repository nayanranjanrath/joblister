import prisma from "../utility/prisma";
import { extractToken } from "../utility/jwt.js"
import { uploadtocloudinar } from "../utility/cloudinary.js";
export const addjob = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { description, companyname, location, type } = req.body;
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
        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const applyjob = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const jobId = req.body.jobId;
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
        return res.status(201).json({ message: "Application submitted successfully", application });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const aproveapplicant = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const applicationId = req.body.applicationId;
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
        const job = await prisma.job.findUnique({
            where: { id: application.jobId },
            include: { postedby: true }
        });
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
        return res.status(200).json({ message: "Applicant approved successfully", updatedApplication });
    }


    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const rejectapplicant = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const applicationId = req.body.applicationId;
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
        const job = await prisma.job.findUnique({
            where: { id: application.jobId },
            include: { postedby: true }
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.postedby.id !== userId) {
            return res.status(403).json({ message: "You are not authorized to approve this applicant" });
        }
        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status: "REJECTED" },
        });
        return res.status(200).json({ message: "Applicant rejected successfully", updatedApplication });
    }


    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const addrequirements = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { jobId, expirience, description } = req.body;
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const job = await prisma.job.findUnique({ where: { id: jobId }, include: { postedby: true } });
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }
        if (job.postedby.id !== userId) {
            return res.status(403).json({ message: "You are not authorized to add requirements to this job" });
        }
        const requirements = await prisma.requirements.create({
            data: {
                expirience,
                description,
                job: { connect: { id: jobId } },
            },
        });
        return res.status(201).json({ message: "Requirements added successfully", requirements });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addskillrequired = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { jobId, skills } = req.body;
        if (!jobId || !skills) {
            return res.status(400).json({ message: "Job ID and skills are required" });
        }
        const userId = extractToken(token);
        if (!userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const requirements = await prisma.requirements.findUnique({ where: { jobId } });

        const updatedRequirements = await prisma.requirements.update({
            where: {
                jobId
            },
            data: {
                skills: {
                    connect: skills.map(id => ({ id }))
                }
            }
        });

        return res.status(201).json({ message: "Skill added successfully", updatedRequirements });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addskills = async (req, res) => {
    try {
        const token = req.cookies.accesstoken;
        if (!token) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { skillname } = req.body;
        if (!skillname) {
            return res.status(400).json({ message: "Skill name is required" });
        }
        const newskill = await prisma.skills.create({
            data: {
                skill: skillname,
            }
        })
        return res.status(201).json({ message: "Skill added successfully", newskill });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getallskills = async (req, res) => {
    try {

        const query = {
            take: 10,
            orderBy: {
                createdAt: "desc"
            }
        };
        if (req.query.cursor) {
            query.cursor = {
                id: req.query.cursor
            };
            query.skip = 1;
        }
        const skills = await prisma.skills.findMany({ ...query });
        return res.status(200).json({ skills });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

const searchskills = async (req, res) => {
    try {
        const { skillname } = req.query;
        if (!skillname) {
            return res.status(400).json({ message: "Skill name is required" });
        }
        
        const query = {
            take: 10,
            orderBy: {
                createdAt: "desc"
            }
        };
        if (req.query.cursor) {
            query.cursor = {
                id: req.query.cursor
            };
            query.skip = 1;
        }
        const skills = await prisma.skills.findMany({
            where: {
                skill: {
                    contains: skillname,
                    mode: "insensitive"
                }
            },
           ...query
        })
        return res.status(200).json({ skills });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}