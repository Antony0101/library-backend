import mongoose from "mongoose";



const BookSchema= new mongoose.Schema({
    name:{type:String,required:true},
    author:{type:String,required:true},
    cost:Number,
    location:String,
    shelf:{type:String,required:true},
    section:String,
    status:{type:String,required:true}
},
{
    timestamps:true
});


export const BookModel= mongoose.model("Books",BookSchema);