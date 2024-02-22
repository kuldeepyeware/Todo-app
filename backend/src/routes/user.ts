import express, { Request, Response } from "express";
import { createUser, findUser, getUserById } from "../db";
import zod from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getErrorMessage } from "../utils/getErrorMessage";
import { authMiddleware } from "../middleware";

export const userRouter = express.Router();

interface CustomRequest extends Request {
  id?: number;
}

const secretKey = process.env.JWT_SECRET as string;

const signUpSchema = zod.object({
  firstName: zod.string(),
  lastName: zod.string(),
  email: zod.string().email({ message: "Name cannot be empty" }),
  password: zod.string(),
});

const signInSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

// const requestHeader = zod.string();

userRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { success } = signUpSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Invalid Input",
      });
    }

    const { email } = req.body;

    const user = await findUser(email);

    if (user) {
      return res.status(411).json({
        message: "Email already registerd",
      });
    }

    const dbResponse = await createUser(req.body);
    const id = dbResponse.id.toString();

    const token = jwt.sign({ id }, secretKey);

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(411).send(getErrorMessage(error));
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const { success } = signInSchema.safeParse(req.body);

    if (!success) {
      return res.status(411).json({
        message: "Invalid Input",
      });
    }

    const { email, password } = req.body;

    const user = await findUser(email, password);

    if (!user) {
      return res.status(411).json({
        message: "User doesn't exist",
      });
    }

    if (!(password === user.password)) {
      return res.status(411).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, secretKey);

    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(411).send(getErrorMessage(error));
  }
});

userRouter.post("/me", async (req: CustomRequest, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res.json({
        message: "Undefined Header",
      });
    }

    // const { success } = requestHeader.safeParse(req.headers.authorization);
    // if (!success) {
    //   return res.status(411).json({
    //     message: "Invalid Input",
    //   });
    // }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    if ((decoded as JwtPayload).id) {
      return res.json({
        validUser: true,
      });
    }

    res.json({
      validUser: false,
    });
  } catch (error) {
    return res.json({
      message: "Not valid request / Not Signin",
    });
  }
});

userRouter.get(
  "/details",
  authMiddleware,
  async (req: CustomRequest, res: Response) => {
    try {
      const id = req.id;

      const user = await getUserById(id as number);

      if (user) {
        return res.json({
          user,
        });
      }
      return res.status(411).json({
        message: "Something get wrong",
      });
    } catch (error) {
      return res.status(411).send(getErrorMessage(error));
    }
  }
);
