import { Router } from "express";
import {signOut, userSignUp, userSingnIn} from "../controller/userController.js";
import { authMiddleware } from "../middlewares/auth.js";

const userRouter: Router = Router();

userRouter.post("/signup", userSignUp);
userRouter.post("/signIn", userSingnIn);
userRouter.post("/signout", signOut);
userRouter.get("/me", authMiddleware, (req, res) => {
  res.json({ userId: req.userId }); 
});

export default userRouter;
