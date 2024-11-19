import { Request, Response, NextFunction } from "express";
import {
  InvalidCredentialsError,
  UnauthorizedError,
} from "../middlewares/errors";

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token)
      throw new UnauthorizedError(
        "Token is required in the Authorization header"
      );

    if (req.body.payment.token !== token)
      throw new InvalidCredentialsError("Invalid token.");

    next();
  } catch (error) {
    next(error);
  }
};
