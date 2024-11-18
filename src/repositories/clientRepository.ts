import Client from "../models/Client";

export default class ClientRepository {
  public findClientByDocumentAndPhone(
    document: string,
    phone: string
  ): Promise<Client | null> {
    return Client.findOne({ where: { document, phone } });
  }

  public createClient(data: {
    document: string;
    name: string;
    email: string;
    phone: string;
  }): Promise<Client> {
    return Client.create(data);
  }
}
