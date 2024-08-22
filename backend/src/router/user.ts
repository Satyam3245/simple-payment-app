import {Router,Request,Response } from 'express'
import { checkUser, createUser, findUser } from '../dbclient';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import { LogInValidator, SignUpValidator } from '../validations/userValidation';
const userRouter = Router();
interface SignIn{
    username : string,
    firstname : string;
    lastname : string,
    password : string
}
userRouter.post('/signin',async (req:Request,res:Response)=>{
    const body:SignIn = req.body;
    const {success} = SignUpValidator.safeParse(body);
    if(!success){
        return res.send('Send Correct Fields')
    }
    if(!body.username || !body.firstname || !body.lastname || !body.password ){
        return res.send('All Fields are Required..');
    }
    const hashPassword = await bcrypt.hash(body.password,10);
    const newBody = {...body,password:hashPassword};
    try {
        const existUser = await checkUser(body.username);
        const user = await createUser(newBody) 
        if(!existUser){
            return res.send('User is already Existed')
        }
        if(!user){
            return res.status(400).json({
                msg :'Invalid credentials'
            })
        }
        const token = await jwt.sign(user,process.env.JWT_SECRET as string);
        return res.status(201).json({
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            msg : 'Internal server error !'
        })
    }
})
userRouter.post('/login',async (req:Request,res:Response)=>{
    const body =  req.body;
    const {success} = LogInValidator.safeParse(body);
    if(!success){
        return res.send('Send Correct Fields')
    }
    if(!body.username || !body.password){
        return res.send('Please Send the All Credentials')
    }
    try {
        const user = await findUser(body.username,body.password);
        if(!user){
            return res.status(400).json({
                msg :'Invalid credentials'
            })
        }
        const token = await jwt.sign(user,process.env.JWT_SECRET as string)
        return res.status(201).json({
            token
        })
    } catch (error) {
        return res.status(500).json({
            msg : 'Something is Happened to Our Database'
        })
    }
})


export default userRouter;