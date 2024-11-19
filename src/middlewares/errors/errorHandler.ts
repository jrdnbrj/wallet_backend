import { Request, Response, NextFunction } from "express";
import {
  BadRequestError,
  InvalidCredentialsError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from ".";
import {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) return next(err);

  if (err instanceof BadRequestError) {
    res.status(400).json({
      success: false,
      cod_error: "20",
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
      cod_error: "01",
      message_error: err.message,
    });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({
      success: false,
      cod_error: "04",
      message_error: err.message,
    });
    return;
  }

  if (err instanceof ConflictError) {
    res.status(409).json({
      success: false,
      cod_error: "09",
      message_error: err.message,
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      success: false,
      cod_error: "61",
      message_error: "Sequelize Validation error",
      data: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      cod_error: "62",
      message_error: "Sequelize Unique constraint violation",
      data: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof ForeignKeyConstraintError) {
    res.status(400).json({
      success: false,
      cod_error: "63",
      message_error: "Sequelize Foreign key constraint error",
    });
    return;
  }

  if (err instanceof DatabaseError) {
    res.status(500).json({
      success: false,
      cod_error: "64",
      message_error: "Sequelize Database error",
    });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    cod_error: "50",
    message_error: `Error interno del servidor. ${err.message}`,
  });
}
