import { Router } from "express";
import { userSingIn, userSingUP } from "../controller/controllers.js";



const userRouter : Router = Router();


userRouter.post("/signUp", userSingUP);
userRouter.post("/sign", userSingIn);


export default userRouter;