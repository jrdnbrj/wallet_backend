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
      }) => {
        const payment = await walletSoapService.makePayment(args);

        return {
          ...payment,
          createdAt: payment.createdAt.toISOString(),
          updatedAt: payment.updatedAt.toISOString(),
        };
      },
      confirmPayment: async (args: { payment: any }) =>
        walletSoapService.confirmPayment(args),
      getWalletBalance: async (args: number) =>
        walletSoapService.getWalletBalance(args),
    },
  },
};
