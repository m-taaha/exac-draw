import {Router} from "express"
import { createRoom, getShapes } from "../controller/roomController.js";
import { authMiddleware } from "../middlewares/auth.js";


const roomRouter: Router = Router();

roomRouter.post("/create", authMiddleware, createRoom);
roomRouter.get("/:roomId/shapes", authMiddleware, getShapes);


export default roomRouter;