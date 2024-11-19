import * as soap from "soap";
import {
  BadRequestError,
  InvalidCredentialsError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../middlewares/errors";
import {
  Model,
  ValidationError,
  ValidationErrorItem,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError,
} from "sequelize";

const CLIENT_SOAP_URL = "http://localhost:8001/soap/client?wsdl";
const WALLET_SOAP_URL = "http://localhost:8001/soap/wallet?wsdl";

type SoapResponse = {
  success: boolean;
  cod_error: string;
  message_error: string;
  data?: any;
};

const mockInstance = {} as Model<any, any>;

export const soapClient = {
  async callSoapMethod(
    methodName: string,
    serviceUrl: string,
    data: any
  ): Promise<SoapResponse> {
    return new Promise((resolve, reject) => {
      soap.createClient(serviceUrl, (err, client) => {
        if (err) {
          console.error("Error creating SOAP client:", err);
          return reject(new Error("Error creating SOAP client"));
        }

        if (!client[methodName]) {
          return reject(
            new Error(`Method ${methodName} not found on SOAP server`)
          );
        }

        client[methodName](data, (error: any, result: any) => {
          if (error) {
            if (error.root && error.root.Envelope) {
              const faultString =
                error.root.Envelope.Body.Fault?.Reason?.Text || "";
              console.error(
                `Error calling SOAP service (${methodName}):`,
                faultString
              );

              if (faultString.includes("BadRequestError"))
                return reject(new BadRequestError(faultString));

              if (faultString.includes("InvalidCredentialsError"))
                return reject(new InvalidCredentialsError(faultString));

              if (faultString.includes("NotFoundError"))
                return reject(new NotFoundError(faultString));

              if (faultString.includes("UnauthorizedError"))
                return reject(new UnauthorizedError(faultString));

              if (faultString.includes("ConflictError"))
                return reject(new ConflictError(faultString));

              if (faultString.includes("ValidationError")) {
                const errors: ValidationErrorItem[] = [
                  new ValidationErrorItem(
                    faultString,
                    "validation error",
                    "field",
                    "value",
                    mockInstance,
                    "customValidator",
                    "",
                    []
                  ),
                ];
                return reject(new ValidationError(faultString, errors));
              }

              if (
                faultString.includes("Unique") &&
                faultString.includes("constraint")
              )
                return reject(new UniqueConstraintError(faultString));

              if (faultString.includes("ForeignKeyConstraintError"))
                return reject(new ForeignKeyConstraintError(faultString));

              if (faultString.includes("DatabaseError"))
                return reject(new DatabaseError(faultString));

              return reject(new Error(faultString));
            }

            return reject(
              new Error(`Error calling SOAP service (${methodName})`)
            );
          }

          resolve(result);
        });
      });
    });
  },

  async registerClient(data: {
    document: string;
    name: string;
    email: string;
    phone: string;
  }): Promise<SoapResponse> {
    return await this.callSoapMethod("registerClient", CLIENT_SOAP_URL, data);
  },

  async rechargeWallet(data: {
    document: string;
    phone: string;
    amount: number;
  }): Promise<SoapResponse> {
    return this.callSoapMethod("rechargeWallet", WALLET_SOAP_URL, data);
  },

  async makePayment(data: {
    document: string;
    phone: string;
    amount: number;
  }): Promise<SoapResponse> {
    return this.callSoapMethod("makePayment", WALLET_SOAP_URL, data);
  },

  async confirmPayment(data: { payment: any }): Promise<SoapResponse> {
    return this.callSoapMethod("confirmPayment", WALLET_SOAP_URL, data);
  },

  async getWalletBalance(data: {
    document: string;
    phone: string;
  }): Promise<SoapResponse> {
    return this.callSoapMethod("getWalletBalance", WALLET_SOAP_URL, data);
  },
};
