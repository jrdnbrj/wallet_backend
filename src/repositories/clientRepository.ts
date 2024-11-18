import Client from "../models/Client";

export default class ClientRepository {
  public findClientByDocument(document: string): Promise<Client | null> {
    return Client.findOne({ where: { document } });
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
