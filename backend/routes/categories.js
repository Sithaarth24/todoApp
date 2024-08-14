const authMiddleware = require('../jwtMiddleware')
const express = require('express')
const router = express.Router()
const Categories = require('../models/categories')
const User = require('../models/users')
const Todo = require('../models/todo')


router.get('/all',authMiddleware,async (req,res)=>{
    const u = await User.findOne({name:req.body.name})

    const categories = await Categories.find({userId:u.id})
    const toSend = categories.map(c => {return {name:c.name,id:c.id}})
    res.send({categories:toSend})
})



router.post('/add',authMiddleware,async (req,res)=>{
    const u = await User.findOne({name:req.body.name})
    const resp = await Categories.insertMany({
        name:req.body.newCat,
        userId:u._id})
    if(resp){
        res.send(resp[0])
    }       
})

router.delete('/delete/:id',authMiddleware,async (req,res)=>{
    const { id } = req.params
    try{
        const cresp = await Categories.findByIdAndDelete(id)
        const tresp = await Todo.deleteMany({categId:id})
        res.send({message:"deleted"})
    }
    catch(e){
        res.status(500).send({message:"dbError"})
    }
    
    
})

module.exports = router