import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from ".";
import { ValidationError as SequelizeValidationError } from "sequelize";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) return next(err);

  if (err instanceof ValidationError || err instanceof BadRequestError) {
    res.status(400).json({
      success: false,
      cod_error: 400,
      message_error: err.message,
    });
    return;
  }

  if (
    err instanceof UnauthorizedError ||
    err instanceof InvalidCredentialsError
  ) {
    res.status(401).json({
      success: false,
      cod_error: 401,
      message_error: err.message,
    });
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({
      success: false,
      cod_error: 403,
      message_error: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      cod_error: 404,
      message_error: err.message,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({
      success: false,
      cod_error: 409,
      message_error: err.message,
    });
    return;
  }

  if (err instanceof SequelizeValidationError) {
    const errors = err.errors.map((errorItem) => ({
      field: errorItem.path,
      message: errorItem.message,
    }));
    res.status(400).json({
      success: false,
      cod_error: 400,
      message_error: "Validation error",
      data: errors,
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    cod_error: 500,
    message_error: `Error interno del servidor. ${err.message}`,
  });
}
