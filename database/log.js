import mongoose from "mongoose";


const LogSchema= new mongoose.Schema({
    tittle:String,
    user:String,
    body:String
},
{
    timestamp:true
});


export const LogModel= mongoose.model("Logs",LogSchema);