import * as soap from "soap";
import {
  BadRequestError,
  InvalidCredentialsError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from "../middlewares/errors";

const SOAP_URL = "http://localhost:8001/soap?wsdl";

type RegisterClientResponse = {
  success: boolean;
  message: string;
  data: any;
};

export const soapClient = {
  async registerClient(data: {
    document: string;
    name: string;
    email: string;
    phone: string;
  }): Promise<RegisterClientResponse> {
    return new Promise((resolve, reject) => {
      soap.createClient(SOAP_URL, (err, client) => {
        if (err) {
          console.error("Error creating SOAP client:", err);
          return reject(new Error("Error creating SOAP client"));
        }

        client.registerClient(data, (error: any, result: any) => {
          if (error) {
            if (error.root && error.root.Envelope) {
              const faultString = error.root.Envelope.Body.Fault.Reason.Text;
              console.error("Error calling SOAP service:", faultString);

              if (faultString.includes("BadRequestError"))
                return reject(new BadRequestError(faultString));

              if (faultString.includes("InvalidCredentialsError"))
                return reject(new InvalidCredentialsError(faultString));

              if (faultString.includes("NotFoundError"))
                return reject(new NotFoundError(faultString));

              if (faultString.includes("ValidationError"))
                return reject(new ValidationError(faultString));

              if (faultString.includes("UnauthorizedError"))
                return reject(new UnauthorizedError(faultString));

              if (faultString.includes("ConflictError"))
                return reject(new ConflictError(faultString));

              if (faultString.includes("ForbiddenError"))
                return reject(new ForbiddenError(faultString));

              return reject(new Error(faultString));
            }

            return reject(new Error("Error calling SOAP service"));
          }

          resolve(result);
        });
      });
    });
  },
};
