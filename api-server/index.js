const app = require("./app");
const dotenv = require('dotenv')

dotenv.config()
const PORT = process.env.PORT || 9000
app.listen(PORT, () => {
    console.log(`api-server is running on port : ${PORT} `);
    
})