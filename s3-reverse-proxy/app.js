const express = require('express')
const httpProxy = require('http-proxy')
const dotenv = require('dotenv')


dotenv.config()
const app = express()

const BASE_PATH = process.env.BASE_PATH

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostName = req.hostname;

    // Extract subdomain for nested domain scenarios
    const subDomain = hostName.includes('.vercel-clone-ox05.onrender.com')
        ? hostName.split('.')[0] // Extract `abhisheklodha` from the start
        : 'default'; // Fallback for cases without the nested subdomain

    console.log('Hostname:', hostName);
    console.log('Extracted Subdomain:', subDomain);

    const resolveTo = `${BASE_PATH}/${subDomain}`;
    console.log('Resolved Target:', resolveTo);
    return proxy.web(req, res, { target: resolveTo, changeOrigin: true, secure: true })
})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url
    if (url === '/') {
        proxyReq.path += 'index.html'
    }
    console.log(proxyReq.path);

})


module.exports = app