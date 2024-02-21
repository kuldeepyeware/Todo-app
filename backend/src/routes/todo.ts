import express, { Request, Response } from "express";
import zod from "zod";
import { authMiddleware } from "../middleware";
import { getErrorMessage } from "../utils/getErrorMessage";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../db";
export const todoRouter = express.Router();

interface CustomRequest extends Request {
  id?: number;
}

interface CustomRequestUpdate extends Request {
  id?: number;
  title?: string;
  description?: string;
  done?: boolean;
}

const todoCreateSchema = zod.object({
  title: zod.string(),
  description: zod.string(),
  done: zod.boolean(),
});

const authIdSchema = zod.number();

const todoUpdateSchema = zod.object({
  id: zod.number(),
  updateTitle: zod.string().optional(),
  updateDescription: zod.string().optional(),
});

todoRouter.post(
  "/create",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const { success } = todoCreateSchema.safeParse(req.body);

      if (!success) {
        return res.status(411).json({
          message: "Invalid Input",
        });
      }

      const idSuccess = authIdSchema.safeParse(req.id);

      if (!idSuccess.success) {
        return res.status(411).json({
          message: "Invalid Authenticated Id",
        });
      }

      const userId = req.id;

      const todoValue = { ...req.body, userId };

      const todo = await createTodo(todoValue);

      return res.status(200).json({
        todo,
      });
    } catch (error) {
      return res.status(411).send(getErrorMessage(error));
    }
  }
);

todoRouter.get(
  "/gettodos",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const { success } = authIdSchema.safeParse(req.id);

      if (!success) {
        return res.status(411).json({
          message: "Invalid Authenticated Id",
        });
      }

      const id = req.id;

      const todos = await getTodos(id as number);

      if (todos.length <= 0) {
        return res.status(200).json({
          todos: "Not Created Todos Yet",
        });
      } else {
        return res.status(200).json({
          todos,
        });
      }
    } catch (error) {
      return res.status(411).send(getErrorMessage(error));
    }
  }
);

todoRouter.put(
  "/update",
  authMiddleware,
  async (req: CustomRequestUpdate, res: Response) => {
    try {
      const { success } = todoUpdateSchema.safeParse(req.body.data);

      if (!success) {
        return res.status(411).json({
          message: "Invalid Input",
        });
      }

      const todo = await updateTodo(req.body.data);

      return res.status(200).json({
        todo,
      });
    } catch (error) {
      return res.status(411).send(getErrorMessage(error));
    }
  }
);

todoRouter.delete(
  "/delete",
  authMiddleware,
  async (req: CustomRequestUpdate, res: Response) => {
    try {
      const todo = await deleteTodo(req.body.id);
      return res.status(200).json({
        todo,
      });
    } catch (error) {
      return res.status(411).send(getErrorMessage(error));
    }
  }
);
