import { Router } from "express";
import { userSignUp, userSingnIn } from "../controller/controllers.js";




const userRouter : Router = Router();


userRouter.post("/signup", userSignUp);
userRouter.post("/signIn", userSingnIn);


export default userRouter;