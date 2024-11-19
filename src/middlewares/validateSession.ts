import { Request, Response, NextFunction } from "express";
import WalletRepository from "../repositories/walletRepository";
import {
  BadRequestError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "../middlewares/errors";

const walletRepository = new WalletRepository();

export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.params.paymentId)
      throw new BadRequestError("Payment id is required.");

    const sessionId = req.headers["x-session-id"] as string;

    if (!sessionId) throw new UnauthorizedError("The session id is required.");

    const payment = await walletRepository.findPaymentById(
      Number(req.params.paymentId)
    );

    if (!payment || payment.sessionId !== sessionId)
      throw new InvalidCredentialsError("The session Id is invalid.");

    req.body.payment = payment;
    next();
  } catch (error) {
    next(error);
  }
};
