// const express = require('express')
const express = require("express");
const app = express()
require('dotenv').config({path:'.env.local'})
//TODO specify the port number inside .env.local
const port = process.env.SERVER_PORT
app.use(express.json())

const deviceRouter = require('./routes/devices')
const tempsRouter = require('./routes/temperatures')

app.use('/devices', deviceRouter)
app.use('/temps', tempsRouter)


const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL).then(r => console.log('Connected to Database'))
mongoose.connection.on('error',(error) => console.error(error))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})