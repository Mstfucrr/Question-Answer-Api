const express = require('express')
const connectDatabase = require('./helpers/database/connectDatabase')
const customErrorHandler = require("./middlewares/errors/customErrorHandler")
const dotenv = require('dotenv')
const routers = require('./routers/index')

dotenv.config({
    path: "./config/env/config.env"
})


connectDatabase()

const app = express()
const PORT = process.env.PORT

app.use("/api",routers)


app.get("/", (req, res) => {
    res.send("Welcome to")
})


app.use(customErrorHandler)

app.listen(PORT, () => {
    console.log(`app started http://127.0.0.1:${PORT} listenings : ${process.env.NODE_ENV}`);
})