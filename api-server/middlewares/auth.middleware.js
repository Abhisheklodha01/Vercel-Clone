const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()

const prisma = new PrismaClient({})

const isAuththenticated = async (req, res, next) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "")
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized request"
        })
    }
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token"
            })
        }
        const id = decodedToken.id
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id)
            }
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }

        req.user = user
        next()

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "server error please try after some time"
        })
    }

}

module.exports = { isAuththenticated }