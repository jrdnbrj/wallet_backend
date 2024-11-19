const SequelizeMock = require("sequelize-mock");
import ClientRepository from "../../src/repositories/clientRepository";
import Client from "../../src/models/Client";

describe("ClientRepository", () => {
  let clientRepository: ClientRepository;
  let clientMock: any;

  beforeEach(() => {
    const DBConnectionMock = new SequelizeMock();

    clientMock = DBConnectionMock.define("Client", {
      id: 1,
      document: "1234567890",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-1234",
    });

    Client.findOne = clientMock.findOne.bind(clientMock);
    Client.create = clientMock.create.bind(clientMock);

    clientRepository = new ClientRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find a client by document and phone", async () => {
    const client = await clientRepository.findClientByDocumentAndPhone(
      "1234567890",
      "555-1234"
    );

    expect(client).toBeDefined();
    expect(client?.name).toBe("John Doe");
    expect(client?.email).toBe("john.doe@example.com");
    expect(client?.phone).toBe("555-1234");
  });

  it("should create a new client", async () => {
    const clientData = {
      document: "0987654321",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "555-5678",
    };

    const client = await clientRepository.createClient(clientData);

    expect(client).toBeDefined();
    expect(client?.name).toBe("Jane Doe");
    expect(client?.email).toBe("jane.doe@example.com");
    expect(client?.phone).toBe("555-5678");
  });
});
