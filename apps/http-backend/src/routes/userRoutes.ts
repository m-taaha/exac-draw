import { Router } from "express";
import { userSingIn, userSingUP } from "../controller/controllers.js";



const userRouter : Router = Router();


userRouter.post("/signup", userSingUP);
userRouter.post("/signIn", userSingIn);


export default userRouter;