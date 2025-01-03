const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')

dotenv.config()

const prisma = new PrismaClient({});

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const exitedUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (exitedUser) {
            return res.status(400).json({
                success: false,
                message: "Email alreay exists please try login",
            });
        }
        const hashPassword = await bcryptjs.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashPassword,
            },
        });
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET
        );
        return res.status(200).json({
            success: true,
            message: "Registration successful",
            token
        });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: "Server error please try again after some time",
        });
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const exitedUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!exitedUser) {
            return res.status(400).json({
                success: false,
                message: "Email does not exists please register first",
            });
        }
        const isPasswordCorrect = await bcryptjs.compare(
            password,
            exitedUser.password
        );
        if (!isPasswordCorrect) {
            return res.status(200).json({
                success: false,
                message: "Wrong Password",
            });
        }
        const token = jwt.sign(
            { id: exitedUser.id, email: exitedUser.email },
            process.env.JWT_SECRET
        );
        return res.status(200).json({
            success: true,
            message: "Signin successful",
            token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error please try again after some time",
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const exitedUser = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        if (!exitedUser) {
            return res.status(400).json({
                success: false,
                message: "Email does not exists please register first",
            });
        }
        const update = await prisma.user.update({
            data: {
                password: password,
            },
            where: {
                email: email,
            },
        });
        return res.status(200).json({
            success: true,
            message: "Password change successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error please try again after some time",
        });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return res.status(200).json({
            message: "User details find successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error please try after some time",
            error,
        });
    }
};


module.exports ={
    registerUser,
    loginUser,
    forgotPassword,
    getUserProfile
}