import WalletRepository from "../repositories/walletRepository";
import ClientSoapService from "../services/clientSoapService";
import { NotFoundError, ConflictError } from "../middlewares/errors";
import crypto from "crypto";
import Payment from "../models/Payment";
import EmailService from "../notifications/emailService";
import path from "path";

class WalletSoapService {
  private walletRepository: WalletRepository;
  private clientSoapService: ClientSoapService;
  private emailService: EmailService;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.clientSoapService = new ClientSoapService();
    this.emailService = new EmailService();
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

    const templatePath = path.resolve(
      __dirname,
      "../templates/rechargeEmail.html"
    );

    await this.emailService.sendEmail(
      client.email,
      "Your Wallet Has Been Successfully Recharged",
      templatePath,
      {
        name: client.name,
        amount: data.amount.toFixed(2),
        balance: wallet.balance.toFixed(2),
      }
    );

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

    const templatePath = path.resolve(
      __dirname,
      "../templates/paymentEmail.html"
    );

    await this.emailService.sendEmail(
      client.email,
      "Secure access information to your Wallet!",
      templatePath,
      {
        name: client.name,
        paymentId: payment.id.toString(),
        amount: payment.amount.toFixed(2),
        sessionId,
        token,
      }
    );

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

    const templatePath = path.resolve(
      __dirname,
      "../templates/paymentConfirmationEmail.html"
    );

    await this.emailService.sendEmail(
      wallet.client!.email,
      "Transaction Completed Successfully",
      templatePath,
      {
        name: wallet.client!.name,
        amount: payment.amount.toString(),
        balance: wallet.balance.toString(),
      }
    );

    return {
      balance: wallet.balance,
      paymentId: payment.id,
      status: payment.status,
    };
  }

  async getWalletBalance(data: { document: string; phone: string }) {
    const client = await this.clientSoapService.getClient(
      data.document,
      data.phone
    );

    const wallet = await this.walletRepository.findWalletByClientId(client.id);

    if (!wallet)
      throw new NotFoundError("Wallet not found. Do a recharge first.");

    return { balance: wallet.balance };
  }
}

export const walletSoapService = new WalletSoapService();
