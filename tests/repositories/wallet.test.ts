import WalletRepository from "../../src/repositories/walletRepository";
const SequelizeMock = require("sequelize-mock");
import Wallet from "../../src/models/Wallet";
import Payment from "../../src/models/Payment";

describe("WalletRepository", () => {
  let walletRepository: WalletRepository;
  let walletMock: any;
  let paymentMock: any;

  beforeEach(() => {
    const DBConnectionMock = new SequelizeMock();

    walletMock = DBConnectionMock.define("Wallet", {
      id: 1,
      clientId: 1,
      balance: 100.0,
    });

    paymentMock = DBConnectionMock.define("Payment", {
      id: 1,
      clientId: 1,
      amount: 50.0,
      status: "PENDING",
      sessionId: "abcd1234",
      token: "987654",
    });

    Wallet.findOne = walletMock.findOne.bind(walletMock);
    Wallet.create = walletMock.create.bind(walletMock);
    Wallet.update = walletMock.update.bind(walletMock);
    Payment.create = paymentMock.create.bind(paymentMock);
    Payment.findOne = paymentMock.findOne.bind(paymentMock);

    walletRepository = new WalletRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should find a wallet by clientId", async () => {
    const wallet = await walletRepository.findWalletByClientId(1);

    expect(wallet).toBeDefined();
    expect(wallet?.balance).toBe(100.0);
    expect(wallet?.clientId).toBe(1);
  });

  it("should create a new wallet", async () => {
    const walletData = {
      clientId: 2,
      balance: 200.0,
    };

    const wallet = await walletRepository.createWallet(walletData);

    expect(wallet).toBeDefined();
    expect(wallet?.balance).toBe(200.0);
    expect(wallet?.clientId).toBe(2);
  });

  it("should update wallet balance", async () => {
    await walletRepository.updateWalletBalance(1, 100.0);

    const wallet = await walletRepository.findWalletByClientId(1);
    expect(wallet?.balance).toBe(100.0);
  });

  it("should create a new payment", async () => {
    const paymentData = {
      clientId: 1,
      amount: 25.0,
      status: "COMPLETED",
      sessionId: "abcd1234",
      token: "987654",
    };

    const payment = await walletRepository.createPayment(paymentData);

    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(25.0);
    expect(payment?.status).toBe("COMPLETED");
  });

  it("should find a payment by ID", async () => {
    const payment = await walletRepository.findPaymentById(1);

    expect(payment).toBeDefined();
    expect(payment?.amount).toBe(50.0);
    expect(payment?.status).toBe("PENDING");
  });
});
