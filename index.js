const express = require('express');
const ytdl = require('ytdl-core');
var cors = require('cors')
const userRouter = require('./src/routes/user');
const  mongoose = require('mongoose');

const connection = async() => {
    try {
        await mongoose.connect('mongodb+srv://raj888:Rsbanerjee888_@cluster0.8tkmh.mongodb.net/abc?retryWrites=true&w=majority')
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