import ClientRepository from "../repositories/clientRepository";
import { ConflictError, ValidationError } from "../middlewares/errors";

class SoapService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async registerClient(data: {
    document: string;
    name: string;
    email: string;
    phone: string;
  }) {
    const { document, name, email, phone } = data;

    if (!document || !name || !email || !phone) {
      throw new ValidationError("Todos los campos son requeridos.");
    }

    const existingClient = await this.clientRepository.findClientByDocument(
      document
    );
    if (existingClient) {
      throw new ConflictError("El cliente ya está registrado.");
    }

    const newClient = await this.clientRepository.createClient({
      document,
      name,
      email,
      phone,
    });

    return {
      success: true,
      message: "Cliente registrado con éxito",
      data: newClient.dataValues,
    };
  }
}

export const soapService = new SoapService();
