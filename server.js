const express = require('express')
const app = express()
require('dotenv').config({path:'.env.local'})
//TODO specify the port number inside .env.local
const port = process.env.SERVER_PORT


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})