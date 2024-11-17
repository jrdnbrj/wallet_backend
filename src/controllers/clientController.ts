import { Request, Response } from "express";
import { soapClient } from "../soap/soapClient";
import { asyncHandler } from "../middlewares/asyncHandler";

export const registerClient = asyncHandler(
  async (req: Request, res: Response) => {
    const { document, name, email, phone } = req.body;

    const client = await soapClient.registerClient({
      document,
      name,
      email,
      phone,
    });

    res.status(201).json({
      success: true,
      cod_error: "00",
      message_error: client.message,
      data: client.data,
    });
  }
);
