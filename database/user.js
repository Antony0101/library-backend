import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import {v4} from 'uuid';

const UserSchema= new mongoose.Schema({
    fullname:{type:String,required:true},
    userid:{type:String,required:true},
    password:String,
    phone:Number,
    role:String,
    refresh_id:[String],
    books:[String],
    fine:Number
},
{
    timestamps:true
});


UserSchema.methods.generateAccessToken = function (permission) {
    return jwt.sign({ user: this._id.toString(), type:"access" ,timestamp: Date.now(), expiry:Date.now()+(15*60*1000) , permission },process.env.JWT_PRIVATE_KEY);
};

UserSchema.statics.findByIdAndPassword = async({userid,pass})=>{
    const user = await UserModel.findOne({userid});
    if(!user) throw new Error("Userid doesn't exist.");
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new Error("Invalid password.");
    return user;
}

UserSchema.statics.userShouldNotExist = async ({userid}) => {
    const user = await UserModel.findOne({ userid });
    if (user) throw new Error("User Already exist.");
    return false;
};

UserSchema.statics.generateRefreshToken = async (_id) => {
    const refresh_id = v4();
    await UserModel.updateOne({_id},{ $addToSet: { refresh_id } });
    return jwt.sign({ user:_id, type:"refresh" ,timestamp: Date.now() , refresh_id },process.env.JWT_PRIVATE_KEY);
};

UserSchema.pre("save", function (next) {
    const user = this;
    const SALT_FACTOR = 8;
    if (!user.isModified("password")) return next();
    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
      if (err) return next(err);
      // hashing password
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        return next();
      });
    });
});

export const UserModel=mongoose.model("Users",UserSchema);
