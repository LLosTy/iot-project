// const express = require('express')
const express = require("express");
const app = express()
const cors = require('cors');
require('dotenv').config({path:'.env.local'})
//TODO specify the port number inside .env.local
const port = process.env.SERVER_PORT
app.use(express.json())

const deviceRouter = require('./routes/devices')
const tempsRouter = require('./routes/temperatures')
const areaRouter = require("./routes/area")
const gatewayRouter = require("./routes/gateways")
const userRouter = require("./routes/users")

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/devices', deviceRouter)
app.use('/temps', tempsRouter)
app.use('/area',areaRouter)
app.use("/gateways", gatewayRouter)
app.use("/users", userRouter)


const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL).then(r => console.log('Connected to Database'))
mongoose.connection.on('error',(error) => console.error(error))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})