import express from 'express';
import {UserModel} from '../database';


const Router=express.Router();


/*
Api         post
path        /signin
desc        signin route
params      none
access      all
*/

Router.post("/signin",async (req,res)=>{
    try{
        await validateSignin(req.body.cred);
        const user = await UserModel.findByEmailAndPassword(req.body.cred);
        const token = await UserModel.generateRefreshToken(user._id);
        return res.status(200).json({message:"success",token});
    }
    catch (error){
        return res.status(500).json({ error: error.message });
    }
});


/*
Api         post
path        /signup
desc        signup route
params      none
access      all
 */
Router.post("/signup",async (req,res)=>{
    try {
        await validateSignup(req.body.user);
        const user = req.body.user;
        await UserModel.userShouldNotExist(user.userid);
        const newuser = await UserModel.create(user);
        const token = await UserModel.generateRefreshToken(newuser._id);
        return res.status(200).json({message:"success",token});
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});