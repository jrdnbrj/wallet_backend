import WalletRepository from "../repositories/walletRepository";
import ClientSoapService from "../services/clientSoapService";
import {
  NotFoundError,
  ConflictError,
  ValidationError,
} from "../middlewares/errors";

class WalletSoapService {
  private walletRepository: WalletRepository;
  private clientSoapService: ClientSoapService;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.clientSoapService = new ClientSoapService();
  }

  async rechargeWallet(data: {
    document: string;
    phone: string;
    amount: number;
  }) {
    const client = await this.clientSoapService.getClient(
      data.document,
      data.phone
    );

    let wallet = await this.walletRepository.findWalletByClientId(client.id);

    if (!wallet) {
      wallet = await this.walletRepository.createWallet({
        clientId: client.id,
        balance: Number(data.amount.toFixed(2)),
      });
    } else {
      wallet.balance += data.amount;
      await this.walletRepository.updateWalletBalance(
        wallet.id,
        Number(wallet.balance.toFixed(2))
      );
    }

    return { balance: wallet.balance };
  }

  async makePayment(data: { document: string; phone: string; amount: number }) {
    const client = await this.clientSoapService.getClient(
      data.document,
      data.phone
    );

    const wallet = await this.walletRepository.findWalletByClientId(client.id);

    if (!wallet) throw new NotFoundError("Wallet not found.");

    if (wallet.balance < data.amount)
      throw new ConflictError("Insufficient balance.");

    const payment = await this.walletRepository.createPayment({
      clientId: client.id,
      amount: Number(data.amount.toFixed(2)),
    });

    return payment.dataValues;
  }

  async confirmPayment(paymentId: number) {
    const payment = await this.walletRepository.findPaymentById(paymentId);

    if (!payment) throw new NotFoundError("Payment not found.");

    if (payment.status === "CONFIRMED")
      throw new ValidationError("Payment has already been confirmed");

    const wallet = await this.walletRepository.findWalletByClientId(
      payment.clientId
    );
    if (!wallet) throw new NotFoundError("Wallet not found.");

    wallet.balance -= payment.amount;
    await this.walletRepository.updateWalletBalance(
      wallet.id,
      Number(wallet.balance.toFixed(2))
    );

    payment.status = "CONFIRMED";
    await payment.save();

    return {
      balance: wallet.balance,
      paymentId: payment.id,
      status: payment.status,
    };
  }

  async getWalletBalance(clientId: number) {
    const wallet = await this.walletRepository.findWalletByClientId(clientId);

    if (!wallet) throw new NotFoundError("Wallet not found.");

    return { balance: wallet.balance };
  }
}

export const walletSoapService = new WalletSoapService();
