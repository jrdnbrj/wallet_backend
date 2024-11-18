import ClientRepository from "../repositories/clientRepository";
import { NotFoundError, ConflictError } from "../middlewares/errors";
import Client from "../models/Client";

export default class ClientSoapService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  public async getClient(document: string, phone: string): Promise<Client> {
    const client = await this.clientRepository.findClientByDocumentAndPhone(
      document,
      phone
    );

    if (!client)
      throw new NotFoundError(
        "There is no client with that document and phone number."
      );

    return client.dataValues;
  }

  async registerClient(data: {
    document: string;
    name: string;
    email: string;
    phone: string;
  }): Promise<Client> {
    const { document, name, email, phone } = data;

    const client = await this.clientRepository.findClientByDocumentAndPhone(
      document,
      phone
    );

    if (client)
      throw new ConflictError(
        "A client with that document and phone number already exists"
      );

    const newClient = await this.clientRepository.createClient({
      document,
      name,
      email,
      phone,
    });

    return newClient.dataValues;
  }
}

export const clientSoapService = new ClientSoapService();
