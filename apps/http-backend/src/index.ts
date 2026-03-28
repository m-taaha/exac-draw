import express from "express"
import userRouter from "./routes/userRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
}))


app.use("/api/v1/user", userRouter);
app.use("/api/v1/room", roomRouter);



app.listen(8000, () => {
    console.log(`http-backend server is running on PORT: http://localhost:8000`);
}); 