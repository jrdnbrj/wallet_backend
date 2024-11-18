import { createServer } from "http";
import * as soap from "soap";
import { soapService } from "../services/soapService";

const serviceDefinition = {
  ClientService: {
    ClientPort: {
      registerClient: async (args: {
        document: string;
        name: string;
        email: string;
        phone: string;
      }) => {
        return soapService.registerClient(args);
      },
    },
  },
};

const wsdl = `
  <definitions name="ClientService"
    targetNamespace="http://www.example.org/ClientService/"
    xmlns:tns="http://www.example.org/ClientService/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/">
    <message name="registerClientRequest">
      <part name="document" type="xsd:string"/>
      <part name="name" type="xsd:string"/>
      <part name="email" type="xsd:string"/>
      <part name="phone" type="xsd:string"/>
    </message>
    <message name="registerClientResponse">
      <part name="message" type="xsd:string"/>
      <part name="success" type="xsd:boolean"/>
      <part name="data" type="xsd:anyType"/>
    </message>
    <portType name="ClientPort">
      <operation name="registerClient">
        <input message="tns:registerClientRequest"/>
        <output message="tns:registerClientResponse"/>
      </operation>
    </portType>
    <binding name="ClientBinding" type="tns:ClientPort">
      <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
      <operation name="registerClient">
        <soap:operation soapAction="http://www.example.org/ClientService/registerClient"/>
        <input>
          <soap:body use="literal"/>
        </input>
        <output>
          <soap:body use="literal"/>
        </output>
      </operation>
    </binding>
    <service name="ClientService">
      <port name="ClientPort" binding="tns:ClientBinding">
        <soap:address location="http://localhost:8001/soap"/>
      </port>
    </service>
  </definitions>
`;

export const startSoapServer = (port: number) => {
  const server = createServer((req, res) => {
    res.end("SOAP server is running...");
  });

  soap.listen(server, "/soap", serviceDefinition, wsdl);
  server.listen(port, () => {
    console.log(`SOAP server running on port ${port}`);
  });
};
