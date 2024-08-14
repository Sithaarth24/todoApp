require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const parser = require('body-parser')
const dbURL = 'mongodb://localhost:27017/todoDb'
const PORT = 5000
const todoRoute = require('./routes/todo')
const authRoute = require('./routes/auth')
const categRoute = require('./routes/categories')

app.use(cors())
app.use(parser.json())

app.use('/auth',authRoute)
app.use('/category',categRoute)
app.use('/todo',todoRoute)

mongoose.connect(dbURL)
    .then(result => 
        app.listen(PORT,() =>{
            console.log("listening to port:",PORT)
        })
    )
    .catch(err => console.log(err))



