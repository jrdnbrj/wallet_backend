import Wallet from "../models/Wallet";
import Payment from "../models/Payment";

export default class WalletRepository {
  public findWalletByClientId(clientId: number): Promise<Wallet | null> {
    return Wallet.findOne({ where: { clientId } });
  }

  public async createWallet(data: {
    clientId: number;
    balance: number;
  }): Promise<Wallet> {
    return await Wallet.create({
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
  }): Promise<Payment> {
    return Payment.create(data);
  }

  public findPaymentById(paymentId: number): Promise<Payment | null> {
    return Payment.findOne({ where: { id: paymentId } });
  }

  public async updatePaymentStatus(
    paymentId: number,
    status: string
  ): Promise<void> {
    await Payment.update({ status }, { where: { id: paymentId } });
  }
}
