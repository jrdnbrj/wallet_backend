import { Request, Response } from "express";
import { soapClient } from "../soap/soapClient";
import { asyncHandler } from "../middlewares/asyncHandler";
import { ValidationError, BadRequestError } from "../middlewares/errors";

export const rechargeWallet = asyncHandler(
  async (req: Request, res: Response) => {
    const { document, phone, amount } = req.body;

    if (!document || !phone || !amount || amount < 0)
      throw new ValidationError("document, phone y amount are required.");

    const data = await soapClient.rechargeWallet(req.body);

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);

export const makePayment = asyncHandler(async (req: Request, res: Response) => {
  const { document, phone, amount } = req.body;

  if (!document || !phone || !amount || amount < 0)
    throw new ValidationError("document, phone y amount are required.");

  const data = await soapClient.makePayment(req.body);

  res.status(201).json({ success: true, cod_error: "00", data });
});

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.paymentId)
      throw new BadRequestError("The payment ID is required.");

    const data = await soapClient.confirmPayment(Number(req.params.paymentId));

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);

export const getWalletBalance = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.params.clientId)
      throw new BadRequestError("The client ID is required.");

    const data = await soapClient.getWalletBalance(Number(req.params.clientId));

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);
