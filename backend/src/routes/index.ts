import express from "express";
import { userRouter } from "./user";
import { todoRouter } from "./todo";

export const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/todo", todoRouter);
