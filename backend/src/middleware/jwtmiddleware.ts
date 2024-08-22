import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
interface AuthenticatedRequest extends Request {
    user?: any;
}
const jwtMiddleware  = (req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    const authHeader = req.headers['authorization'];
    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({message: 'Access Denied. No token provided.'})
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
      } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
      }
}