const authMiddleware = require('../jwtMiddleware')
const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
const User = require('../models/users')

router.get('/all',authMiddleware,async (req,res)=>{
    const u = await User.findOne({name:req.body.name})
    const todos = await Todo.find({userId:u._id});   

    res.send({todos:todos})
})

router.put('/check/:id',authMiddleware,async (req,res)=>{
    const { id } = req.params
    const { checked } = req.body
    try{
        const r = await Todo.updateOne({_id:id},{status:checked})
        if(r)
            res.send({message:"deleted"})
        else
            res.send({message:"dbError"})
    }
    catch(e){
        console.log(e)
        res.send({message:"dbError"})
    }
})

router.delete('/delete/:id',authMiddleware,async (req,res)=>{
    const { id } = req.params
    try{
        const r = await Todo.findByIdAndDelete(id)
        if(r)
            res.send({message:"deleted"})
        else
            res.send({message:"dbError"})
    }
    catch(e){
        console.log(e)
        res.send({message:"dbError"})
    }
})

router.post('/add/:catId',authMiddleware,async (req,res)=>{
    const { catId } = req.params
    const {task,checked,name} = req.body
    const u = await User.findOne({name:name})
    const newTodo = new Todo({
        title:task,
        userId:u.id,
        categId:catId,
        status:checked,
        Date:Date.now
    })
    const resp = await newTodo.save()
    if(resp){
        res.json(resp)
    }
    else res.json({response:"notAdded"})
})

module.exports = router