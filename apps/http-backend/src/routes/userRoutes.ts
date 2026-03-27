import { Router } from "express";
import { userSingIn, userSingUp } from "../controller/controllers.js";



const userRouter : Router = Router();


userRouter.post("/signup", userSingUp);
userRouter.post("/signIn", userSingIn);


export default userRouter;