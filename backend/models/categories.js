const mongoose = require('mongoose')
const schema = mongoose.Schema

const categorySchema = new schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    }
},{ timestamps:true })

const Categories = mongoose.model('categories',categorySchema)
module.exports = Categories