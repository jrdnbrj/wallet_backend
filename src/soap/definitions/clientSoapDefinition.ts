import { clientSoapService } from "../../services/clientSoapService";

export const clientSoapDefinition = {
  ClientService: {
    ClientPort: {
      registerClient: async (args: {
        document: string;
        name: string;
        email: string;
        phone: string;
      }) => clientSoapService.registerClient(args),
    },
  },
};
