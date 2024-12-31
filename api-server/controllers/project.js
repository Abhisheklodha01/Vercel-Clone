const { PrismaClient } = require('@prisma/client')
const { z } = require("zod")
const { generateSlug } = require('random-word-slugs')

const prisma = new PrismaClient({})

const createProject = async (req, res) => {

    const schema = z.object({
        name: z.string(),
        gitUrl: z.string()
    })

    const safeParseResult = schema.safeParse(req.body)
    if (safeParseResult.error) {
        return res.status(400).json({
            error: safeParseResult.error
        })
    }

    const { name, gitUrl } = safeParseResult.data

    const project = await prisma.project.create({
        data: {
            name,
            gitUrl,
            subDomain: generateSlug()
        }
    })
    return res.status(201).json({
        message: "Project Creation Successful",
        project
    })
}

module.exports = { createProject }