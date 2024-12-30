const app = require("./app");

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Reverse Proxy Running on port: ${PORT}`);
    
})