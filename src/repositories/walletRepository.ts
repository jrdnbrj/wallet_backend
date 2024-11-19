import Wallet from "../models/Wallet";
import Payment from "../models/Payment";
import Client from "../models/Client";

export default class WalletRepository {
  public findWalletByClientId(clientId: number): Promise<Wallet | null> {
    return Wallet.findOne({
      where: { clientId },
      include: [
        {
          model: Client,
          as: "client",
        },
      ],
    });
  }

  public createWallet(data: {
    clientId: number;
    balance: number;
  }): Promise<Wallet> {
    return Wallet.create({
      clientId: data.clientId,
      balance: data.balance,
    });
  }

  public async updateWalletBalance(
    walletId: number,
    newBalance: number
  ): Promise<void> {
    await Wallet.update({ balance: newBalance }, { where: { id: walletId } });
  }

  public createPayment(data: {
    clientId: number;
    amount: number;
    status?: string;
    sessionId: string;
    token: string;
  }): Promise<Payment> {
    return Payment.create(data);
  }

  public findPaymentById(paymentId: number): Promise<Payment | null> {
    return Payment.findOne({ where: { id: paymentId } });
  }
}
