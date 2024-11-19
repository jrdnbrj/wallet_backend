import { clientSoapService } from "../../services/clientSoapService";

export const clientSoapDefinition = {
  ClientService: {
    ClientPort: {
      registerClient: async (args: {
        document: string;
        name: string;
        email: string;
        phone: string;
      }) => {
        const client = await clientSoapService.registerClient(args);

        return {
          ...client,
          createdAt: client.createdAt.toISOString(),
          updatedAt: client.updatedAt.toISOString(),
        };
      },
    },
  },
};
