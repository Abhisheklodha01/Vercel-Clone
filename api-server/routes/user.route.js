const { Router } = require('express')
const {
    registerUser,
    loginUser,
    forgotPassword,
    getUserProfile } = require('../controllers/user')

const router = Router()


router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.get("/user-profile", getUserProfile)


module.exports = router