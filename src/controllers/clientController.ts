import { Request, Response } from "express";
import { soapClient } from "../soap/soapClient";
import { asyncHandler } from "../middlewares/asyncHandler";
import { BadRequestError } from "../middlewares/errors";

export const registerClient = asyncHandler(
  async (req: Request, res: Response) => {
    const { document, name, email, phone } = req.body;

    if (!document || !name || !email || !phone)
      throw new BadRequestError(
        "document, name, email and phone are required."
      );

    const data = await soapClient.registerClient(req.body);

    res.status(201).json({ success: true, cod_error: "00", data });
  }
);
