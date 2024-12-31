const {Router} = require('express')
const { createProject } = require('../controllers/project')

const router = Router()


router.post("/create-project", createProject)


module.exports = router