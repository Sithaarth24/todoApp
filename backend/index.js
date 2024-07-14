const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const dbURL = 'mongodb://localhost:27017/todoDb'
const PORT = 5000
const User = require('./models/users')
const Todo = require('./models/todo')
const Categories = require('./models/categories')

app.use(cors())
app.use(express.json())


mongoose.connect(dbURL)
    .then(result => console.log("connected"))
    .catch(err => console.log(err))

app.post('/signup',async (req,res)=>{
    const u =await User.findOne({name:req.body.name,password:req.body.password})
    console.log(u)
    if(u){
        res.send({response:"notAvailable"})
        return
    }
    const user = new User({
        name:req.body.name,
        password:req.body.password
    })
    await user.save()
        .then(response => res.send({response:"added"}))
        .catch(err => res.send({response:"dbError"}))
})

app.post('/todo/add',async (req,res)=>{
    console.log("taskaddcameserver")
    const {task,checked,category,user} = req.body
    console.log(task,checked,category,user)
    const u = await User.findOne({name:user})
    const resp = await Todo.insertMany({
        title:task,
        userId:u.id,
        category:category,
        status:checked,
        Date:Date.now
    })
    if(resp){
        console.log(resp)
        res.json({response:"added"})
    }
    else res.json({response:"notAdded"})
})

app.post('/login',async (req,res)=>{
    const u =await User.findOne({name:req.body.name,password:req.body.password})
    console.log(u)
    if(u){
        res.send({response:"userFound"})
        return
    }
    res.send({response:"userNotFound"})
})

app.get(':user/categories/all',async (req,res)=>{
    console.log("came")
    const categories = await Categories.find()
    console.log(categories)
    res.send({categories:categories})
})

app.get(':user/todo/all',async (req,res)=>{
    console.log('todoallcame')
    const todos = await Todo.find({});
    console.log(todos)
    const tosend = todos.map(t => {return {title:t.title,status:t.status,category:t.category}})
    res.send(tosend)
})

app.post('/categories/add',async (req,res)=>{
    const u = await User.findOne({name:req.body.name})
    if(u){
        const resp = await Categories.insertMany({name:req.body.newCat,userId:u.id})
        if(resp){
            console.log(resp)
            res.send("added")
        }
    }
        
})

app.listen(PORT,() =>{console.log("listening to port:",PORT)})

