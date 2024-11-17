import * as soap from "soap";

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
            console.error("Error calling SOAP service:", error);
            return reject(new Error("Error calling SOAP service"));
          }

          resolve(result);
        });
      });
    });
  },
};
