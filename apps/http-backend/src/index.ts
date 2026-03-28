import express from "express"
import userRouter from "./routes/userRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());



app.use("/api/v1/user", userRouter);
app.use("/api/v1/room", roomRouter);



app.listen(8000, () => {
    console.log(`http-backend server is running on PORT: http://localhost:8000`);
}); 