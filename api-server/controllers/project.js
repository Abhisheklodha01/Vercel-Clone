const { PrismaClient } = require('@prisma/client')
const { z } = require("zod")
const { generateSlug } = require('random-word-slugs')

const prisma = new PrismaClient({})

const createProject = async (req, res) => {
    const {userId} = req.body
    console.log(userId);
    
    const schema = z.object({
        name: z.string(),
        gitUrl: z.string(),
        userId: z.number(),
        subDomain: z.string()
    })

    const safeParseResult = schema.safeParse(req.body)
    if (safeParseResult.error) {
        return res.status(400).json({
            error: safeParseResult.error
        })
    }

    try {
        const { name, gitUrl, userId, subDomain } = safeParseResult.data

    const project = await prisma.project.create({
        data: {
            name: name,
            gitUrl,
            userId,
            subDomain: subDomain.trim()
        }
    })
    return res.status(201).json({
        message: "Project Creation Successful",
        project
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error in Project Creation",
        })
    }
}

const getUserProjects = async (req, res) => {
    const userId = req.params.id 
    console.log(userId);
    
    try {
        const projects = await prisma.project.findMany({
            where : {
                userId: Number(userId)
            }
        })
        return res.status(200).json({
            message: "Projects find successfully",
            projects
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
        })
    }
}

module.exports = { createProject, getUserProjects }