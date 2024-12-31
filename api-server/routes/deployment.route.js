const { Router } = require('express')
const { createDeployment, getDeployementLogs } = require('../controllers/deployment')

const router = Router()


router.post("/deploy-project", createDeployment)
router.get("/getlogs/:id", getDeployementLogs)


module.exports = router