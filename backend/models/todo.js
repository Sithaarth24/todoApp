const mongoose = require('mongoose')
const schema = mongoose.Schema

const todoSchema = new schema({
    title:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        default:0
    },
    priority:{
        type:Number,
        default:0
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{ timestamps:true })

const Todo = mongoose.model('todo',todoSchema)
module.exports = Todo