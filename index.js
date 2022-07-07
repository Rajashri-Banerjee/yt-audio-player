const express = require('express');
const dotenv = require('dotenv')
const ytdl = require('ytdl-core');
var cors = require('cors')
const userRouter = require('./src/routes/user');
const  mongoose = require('mongoose');
dotenv.config()

const connection = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB connected')
    }
    catch(error) {
        console.log(error)
    }
}

connection()

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3001 
app.use('/user',userRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})