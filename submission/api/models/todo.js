const mongoose=require('mongoose');

const todoSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title: {type:String,required:true},
    note:{type:String,required:true}
});

module.exports=mongoose.model('Todo',todoSchema);