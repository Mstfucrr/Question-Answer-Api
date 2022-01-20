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

app.use(express.json())
app.use("/api", routers)


app.get("/", (req, res) => {
    res.send("Welcome to")
})


app.use(customErrorHandler)

app.listen(PORT, () => {
    console.log(`app started http://127.0.0.1:${PORT} listenings : ${process.env.NODE_ENV}
POSTMAN : https://web.postman.co/workspace/Api~1197f635-a7c5-4692-8749-0dcf3f2dbd20/collection/19037639-194da99d-dbf2-4ec5-8826-716b8218ee5d?ctx=documentation`);
})