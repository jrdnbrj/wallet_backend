import ClientRepository from "../repositories/clientRepository";
import { NotFoundError, ConflictError } from "../middlewares/errors";
import Client from "../models/Client";
import EmailService from "../notifications/emailService";
import path from "path";

export default class ClientSoapService {
  private clientRepository: ClientRepository;
  private emailService: EmailService;

  constructor() {
    this.clientRepository = new ClientRepository();
    this.emailService = new EmailService();
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
    const { document, phone } = data;

    const client = await this.clientRepository.findClientByDocumentAndPhone(
      document,
      phone
    );

    if (client)
      throw new ConflictError(
        "A client with that document and phone number already exists"
      );

    const newClient = await this.clientRepository.createClient(data);

    const templatePath = path.resolve(
      __dirname,
      "../templates/userRegistrationEmail.html"
    );

    await this.emailService.sendEmail(
      newClient.email,
      "Welcome to your Wallet!",
      templatePath,
      {
        name: newClient.name,
        document,
        email: newClient.email,
        phone,
      }
    );

    return newClient.dataValues;
  }
}

export const clientSoapService = new ClientSoapService();
