const express = require('express')
const httpProxy = require('http-proxy')
const dotenv = require('dotenv')


dotenv.config()
const app = express()

const BASE_PATH = process.env.BASE_PATH

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostName = req.hostname;
    const subDomain = hostName.split('.vercel-clone-ox05.onrender.com')[0]

    const resolveTo = `${BASE_PATH}/${subDomain}`
    console.log(BASE_PATH);
    console.log(subDomain);
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