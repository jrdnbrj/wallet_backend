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

const CLIENT_SOAP_URL = "http://localhost:8001/soap/client?wsdl";
const WALLET_SOAP_URL = "http://localhost:8001/soap/wallet?wsdl";

type SoapResponse = {
  success: boolean;
  cod_error: string;
  message_error: string;
  data?: any;
};

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
              const faultString = error.root.Envelope.Body.Fault.Reason.Text;
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
    clientId: number;
    amount: number;
  }): Promise<SoapResponse> {
    return this.callSoapMethod("rechargeWallet", WALLET_SOAP_URL, data);
  },

  async makePayment(data: {
    clientId: number;
    amount: number;
  }): Promise<SoapResponse> {
    return this.callSoapMethod("makePayment", WALLET_SOAP_URL, data);
  },

  async confirmPayment(paymentId: number): Promise<SoapResponse> {
    return this.callSoapMethod("confirmPayment", WALLET_SOAP_URL, paymentId);
  },

  async getWalletBalance(clientId: number): Promise<SoapResponse> {
    return this.callSoapMethod("getWalletBalance", WALLET_SOAP_URL, clientId);
  },
};
