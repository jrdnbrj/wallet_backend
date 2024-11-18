export class BadRequestError extends Error {
  constructor(message: string = "Solicitud inválida.") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message: string = "Credenciales incorrectas.") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Recurso no encontrado.") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string = "Error de validación.") {
    super(message);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = "No autorizado.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Acceso prohibido.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class ConflictError extends Error {
  constructor(message: string = "Conflicto.") {
    super(message);
    this.name = "ConflictError";
  }
}
