import { Request, Response } from "express";
import { soapClient } from "../soap/soapClient";
import { asyncHandler } from "../middlewares/asyncHandler";
import { BadRequestError } from "../middlewares/errors";

export const rechargeWallet = asyncHandler(
  async (req: Request, res: Response) => {
    const { document, phone, amount } = req.body;

    if (!document || !phone || !amount || amount < 0)
      throw new BadRequestError("document, phone y amount are required.");

    const data = await soapClient.rechargeWallet(req.body);

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);

export const makePayment = asyncHandler(async (req: Request, res: Response) => {
  const { document, phone, amount } = req.body;

  if (!document || !phone || !amount || amount < 0)
    throw new BadRequestError("document, phone y amount are required.");

  const data = await soapClient.makePayment(req.body);

  res.status(201).json({ success: true, cod_error: "00", data });
});

export const confirmPayment = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await soapClient.confirmPayment({
      payment: req.body.payment.dataValues,
    });

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);

export const getWalletBalance = asyncHandler(
  async (req: Request, res: Response) => {
    const { document, phone } = req.body;

    if (!document || !phone)
      throw new BadRequestError("document and phone are required.");

    const data = await soapClient.getWalletBalance(req.body);

    res.status(200).json({ success: true, cod_error: "00", data });
  }
);
