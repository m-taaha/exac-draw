import {Router} from "express"
import { createRoom } from "../controller/roomController.js";
import { authMiddleware } from "../middlewares/auth.js";


const roomRouter: Router = Router();

roomRouter.post("/create", authMiddleware, createRoom);


export default roomRouter;