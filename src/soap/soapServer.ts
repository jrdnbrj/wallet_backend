import { createServer } from "http";
import * as soap from "soap";
import { clientSoapDefinition } from "./definitions/clientSoapDefinition";
import { walletSoapDefinition } from "./definitions/walletSoapDefinition";
import * as fs from "fs";
import * as path from "path";

const clientWsdl = fs.readFileSync(
  path.join(__dirname, "../wsdl/clientService.wsdl"),
  "utf8"
);
const walletWsdl = fs.readFileSync(
  path.join(__dirname, "../wsdl/walletService.wsdl"),
  "utf8"
);

export const startSoapServers = (port: number) => {
  const server = createServer();

  soap.listen(server, "/soap/client", clientSoapDefinition, clientWsdl);
  soap.listen(server, "/soap/wallet", walletSoapDefinition, walletWsdl);

  server.listen(port, () => {
    console.log(`SOAP server running on port ${port}`);
  });
};
