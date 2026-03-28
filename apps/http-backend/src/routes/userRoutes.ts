import { Router } from "express";
import { userSignUp, userSingnIn } from "../controllers/userController.js";




const userRouter : Router = Router();


userRouter.post("/signup", userSignUp);
userRouter.post("/signIn", userSingnIn);


export default userRouter;