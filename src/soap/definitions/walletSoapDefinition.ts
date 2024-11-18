import { walletSoapService } from "../../services/walletSoapService";

export const walletSoapDefinition = {
  WalletService: {
    WalletPort: {
      rechargeWallet: async (args: {
        document: string;
        phone: string;
        amount: number;
      }) => walletSoapService.rechargeWallet(args),
      makePayment: async (args: {
        document: string;
        phone: string;
        amount: number;
      }) => walletSoapService.makePayment(args),
      confirmPayment: async (args: number) =>
        walletSoapService.confirmPayment(args),
      getWalletBalance: async (args: number) =>
        walletSoapService.getWalletBalance(args),
    },
  },
};
