const {Router} = require('express')
const { createProject, getUserProjects } = require('../controllers/project')

const router = Router()


router.post("/create-project", createProject)
router.get("/user-projects/:id", getUserProjects)


module.exports = router