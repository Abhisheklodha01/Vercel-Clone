const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

        const exitedUser = await prisma.user.findUnique({
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
        const accessToken = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET
        );
        return res.status(200).json({
            success: true,
            message: "Registration successful",
            accessToken
        });
    } catch (error) {
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

        const exitedUser = await prisma.user.findUnique({
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
        const accessToken = jwt.sign(
            { id: exitedUser.id, email: exitedUser.email },
            process.env.JWT_SECRET
        );
        return res.status(200).json({
            success: true,
            message: "Signin successful",
            accessToken
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error please try again after some time",
        });
    }
};

