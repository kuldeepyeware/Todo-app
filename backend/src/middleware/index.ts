import { Request, Response, NextFunction } from "express";
import zod from "zod";
import { getErrorMessage } from "../utils/getErrorMessage";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  id?: number;
}

const secretKey = process.env.JWT_SECRET as string;
const authorizationSchema = zod.string();

export const authMiddleware = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { success } = authorizationSchema.safeParse(
      req.headers.authorization
    );

    if (!success) {
      return res.status(411).json({
        message: "Invalid Header",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(411).json({
        message: "Invalid Header",
      });
    }

    const token = authHeader.split(" ")[1];

    if (token == "null") {
      return res.status(411).json({
        message: "Invalid JWT",
      });
    }

    const decoded = jwt.verify(token, secretKey);

    if (!(decoded as JwtPayload).id) {
      return res.status(411).json({
        message: "Invalid token",
      });
    }

    let id = (decoded as JwtPayload).id;

    req.id = parseInt(id);

    // console.log(req.id + typeof req.id);

    next();
  } catch (error) {
    return res.status(411).send(getErrorMessage(error));
  }
};
