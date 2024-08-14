const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Categories = require('../models/categories')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

router.post('/signup',async (req,res)=>{
    const u =await User.findOne({name:req.body.name,password:req.body.password})
    if(u){
        res.send({response:"notAvailable"})
        return
    }
    const encryptedPass = await bcrypt.hash(req.body.password,8)
    const user = new User({
        name:req.body.name,
        password:encryptedPass
    })
    const initCategory = async (uid) => {
        let retrn = false;
        await Categories.insertMany({
            name:"newCategory",
            userId:uid
        })
        .then(response => {
            
        })
    }
    await user.save()
        .then(response => {
            try{
                if(initCategory(response.id))
                    res.send({response:"added"})
                else throw new Error("error")
            }
            catch(e){
                res.send({response:"Server Error"})
            }
        })
        .catch(err => {
            if(err.code === 11000)
                res.send({response:"notAvailable"})
            else res.send({response:"dbError"})})
})

router.post('/login',async (req,res)=>{
    const u =await User.findOne({name:req.body.name})
    if(u){
        if(await bcrypt.compare(req.body.password,u.password)){
            const token = jwt.sign({user:u.name},JWT_SECRET_KEY,{expiresIn : '1h'})
            res.send({response:"userFound",token:token})
        }
            
        else res.send({response:"IncorrectPassword"})
    }
    else res.send({response:"userNotFound"})
})

module.exports = router