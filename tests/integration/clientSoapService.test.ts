const SequelizeMock = require("sequelize-mock");
import { clientSoapService } from "../../src/services/clientSoapService";
import ClientRepository from "../../src/repositories/clientRepository";
import EmailService from "../../src/notifications/emailService";

jest.mock("../../src/repositories/clientRepository");
jest.mock("../../src/notifications/emailService");

const DBConnectionMock = new SequelizeMock();
const clientMock = DBConnectionMock.define("Client", {
  id: 1,
  document: "1234567890",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "555-1234",
});

describe("ClientSoapService - Integration with Mocks", () => {
  let createClientSpy: jest.SpyInstance;
  let findClientSpy: jest.SpyInstance;
  let sendEmailSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock methods in ClientRepository
    createClientSpy = jest
      .spyOn(ClientRepository.prototype, "createClient")
      .mockResolvedValue(clientMock.build());
    findClientSpy = jest
      .spyOn(ClientRepository.prototype, "findClientByDocumentAndPhone")
      .mockResolvedValue(null);

    // Mock sendEmail in EmailService
    sendEmailSpy = jest
      .spyOn(EmailService.prototype, "sendEmail")
      .mockResolvedValue(undefined);
  });

  it("should register a new client and send an email", async () => {
    const clientData = {
      document: "1234567890",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
    };

    const client = await clientSoapService.registerClient(clientData);

    expect(findClientSpy).toHaveBeenCalledWith(
      clientData.document,
      clientData.phone
    );
    expect(createClientSpy).toHaveBeenCalledWith(clientData);
    expect(sendEmailSpy).toHaveBeenCalledWith(
      clientData.email,
      "Welcome to your Wallet!",
      expect.any(String), // Path del template
      {
        name: clientData.name,
        document: clientData.document,
        email: clientData.email,
        phone: clientData.phone,
      }
    );
    expect(client).toBeDefined();
    expect(client.document).toBe(clientData.document);
  });

  it("should throw an error if client already exists", async () => {
    findClientSpy.mockResolvedValue(clientMock.build());

    const clientData = {
      document: "1234567890",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
    };

    await expect(clientSoapService.registerClient(clientData)).rejects.toThrow(
      "A client with that document and phone number already exists"
    );
    expect(findClientSpy).toHaveBeenCalled();
    expect(createClientSpy).not.toHaveBeenCalled();
    expect(sendEmailSpy).not.toHaveBeenCalled();
  });
});
