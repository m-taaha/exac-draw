import { Router } from "express";
import { signOut, userSignUp, userSingnIn } from "../controller/userController.js";




const userRouter : Router = Router();


userRouter.post("/signup", userSignUp);
userRouter.post("/signIn", userSingnIn);
userRouter.post("/signout", signOut);


export default userRouter;