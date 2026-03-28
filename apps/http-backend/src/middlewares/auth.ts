import { NextFunction, Request, Response } from "express";
import  jwt  from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
if(!JWT_SECRET){
    throw new Error("JWT_SECRET_KEY is not defined in environment variable");
}


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const token = req.cookies.token

        if(!token){
            return res.status(401).json({
                message: "Authenticaton Required"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {userId: string}

        req.userId = decoded.userId;

        next();


    } catch(error) {
        res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}