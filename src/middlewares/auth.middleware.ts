import { Request, Response, NextFunction } from "express";
import { UVerifyToken } from "../utils/jwt.utils";

export const MAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw Error("Unauthorize!");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw Error("Unauthorize!");
    }

    const decoded = await UVerifyToken(token);
    req.admin = decoded as typeof req.admin;

    next();
  } catch (error) {
    next(Error("Unauthorize!"));
  }
};
