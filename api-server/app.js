const express = require("express");
const projectRouter = require('./routes/project.route')
const deploymentRouter = require('./routes/deployment.route')
const userRouter = require('./routes/user.route')
const cors = require('cors')


const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
  return res.send("Working fine")
})

app.use("/api/projects", projectRouter)
app.use("/api/deployments", deploymentRouter)
app.use("/api/users", userRouter)




module.exports = app;
