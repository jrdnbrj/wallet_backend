import WalletRepository from "../repositories/walletRepository";
import ClientSoapService from "../services/clientSoapService";
import { NotFoundError, ConflictError } from "../middlewares/errors";
import crypto from "crypto";
import Payment from "../models/Payment";

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

    if (!wallet)
      throw new NotFoundError("Wallet not found. Do a recharge first.");

    if (wallet.balance < data.amount)
      throw new ConflictError("Insufficient balance.");

    const sessionId = crypto.randomUUID();
    const token = Math.floor(100000 + Math.random() * 900000).toString();

    const payment = await this.walletRepository.createPayment({
      clientId: client.id,
      amount: Number(data.amount.toFixed(2)),
      sessionId,
      token,
    });

    console.log(`Email sent to client with token: ${token}`);

    return payment.dataValues;
  }

  async confirmPayment(data: { payment: any }) {
    let payment = Payment.build(data.payment, { isNewRecord: false });

    if (payment.status === "COMPLETED")
      throw new ConflictError("Payment has already been completed.");

    const wallet = await this.walletRepository.findWalletByClientId(
      payment.clientId
    );

    if (!wallet)
      throw new NotFoundError(
        "Wallet not found. Do a recharge and make a payment before confirm a payment."
      );

    wallet.balance -= payment.amount;
    await this.walletRepository.updateWalletBalance(
      wallet.id,
      Number(wallet.balance.toFixed(2))
    );

    payment.status = "COMPLETED";
    await payment.save();

    return {
      balance: wallet.balance,
      paymentId: payment.id,
      status: payment.status,
    };
  }

  async getWalletBalance(clientId: number) {
    const wallet = await this.walletRepository.findWalletByClientId(clientId);

    if (!wallet)
      throw new NotFoundError("Wallet not found. Do a recharge first.");

    return { balance: wallet.balance };
  }
}

export const walletSoapService = new WalletSoapService();
