const express = require('express')
const app = express()
//TODO specify the port number inside .env.local
const port = 8080


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})