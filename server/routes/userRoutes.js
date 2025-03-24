import express from "express";
import userAuth from "../middleware/userAuth.js";  // Ensure correct path & export type
import { getUserData } from "../controllers/userController.js";  // Ensure correct path & export type

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

export default userRouter;
