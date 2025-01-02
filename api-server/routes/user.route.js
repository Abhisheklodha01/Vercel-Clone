const { Router } = require('express')
const {
    registerUser,
    loginUser,
    forgotPassword,
    getUserProfile } = require('../controllers/user')
const {isAuththenticated} = require('../middlewares/auth.middleware')    

const router = Router()


router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/forgot-password", forgotPassword)
router.get("/user-profile", isAuththenticated, getUserProfile)


module.exports = router