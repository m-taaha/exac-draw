import express from "express"
import userRouter from "./routes/userRoutes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));



app.use("api/v1/user", userRouter);



app.listen(8000, () => {
    console.log(`http-backend server is running on PORT: http://localhost:8000`);
}); 