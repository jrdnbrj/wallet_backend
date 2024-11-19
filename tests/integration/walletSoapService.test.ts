const SequelizeMock = require("sequelize-mock");
import { walletSoapService } from "../../src/services/walletSoapService";
import WalletRepository from "../../src/repositories/walletRepository";
import ClientSoapService from "../../src/services/clientSoapService";
import EmailService from "../../src/notifications/emailService";

jest.mock("../../src/repositories/walletRepository");
jest.mock("../../src/services/clientSoapService");
jest.mock("../../src/notifications/emailService");

const DBConnectionMock = new SequelizeMock();
const walletMock = DBConnectionMock.define("Wallet", {
  id: 1,
  clientId: 1,
  balance: 50.0,
});
const clientMock = DBConnectionMock.define("Client", {
  id: 1,
  document: "1234567890",
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "555-5678",
  createdAt: new Date(),
  updatedAt: new Date(),
});

describe("WalletSoapService - Integration with Mocks", () => {
  let findWalletSpy: jest.SpyInstance;
  let createWalletSpy: jest.SpyInstance;
  let updateWalletSpy: jest.SpyInstance;
  let getClientSpy: jest.SpyInstance;
  let sendEmailSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock WalletRepository
    findWalletSpy = jest
      .spyOn(WalletRepository.prototype, "findWalletByClientId")
      .mockResolvedValue(walletMock.build());
    createWalletSpy = jest
      .spyOn(WalletRepository.prototype, "createWallet")
      .mockResolvedValue(walletMock.build());
    updateWalletSpy = jest
      .spyOn(WalletRepository.prototype, "updateWalletBalance")
      .mockResolvedValue(undefined);

    // Mock ClientSoapService
    getClientSpy = jest
      .spyOn(ClientSoapService.prototype, "getClient")
      .mockResolvedValue(clientMock);

    // Mock EmailService
    sendEmailSpy = jest
      .spyOn(EmailService.prototype, "sendEmail")
      .mockResolvedValue(undefined);
  });

  it("should recharge wallet and send an email", async () => {
    const data = {
      document: "1234567890",
      phone: "555-5678",
      amount: 50.0,
    };

    const wallet = await walletSoapService.rechargeWallet(data);

    expect(getClientSpy).toHaveBeenCalledWith(data.document, data.phone);
    expect(findWalletSpy).toHaveBeenCalledWith(clientMock.id);
    expect(updateWalletSpy).toHaveBeenCalledWith(1, 100.0);
    expect(sendEmailSpy).toHaveBeenCalledWith(
      clientMock.email,
      "Your Wallet Has Been Successfully Recharged",
      expect.any(String),
      {
        name: clientMock.name,
        amount: "50.00",
        balance: "100.00",
      }
    );
    expect(wallet.balance).toBe(100.0);
  });

  it("should create a wallet if none exists and send an email", async () => {
    findWalletSpy.mockResolvedValue(null);

    const data = {
      document: "1234567890",
      phone: "555-5678",
      amount: 50.0,
    };

    const wallet = await walletSoapService.rechargeWallet(data);

    expect(getClientSpy).toHaveBeenCalledWith(data.document, data.phone);
    expect(findWalletSpy).toHaveBeenCalledWith(clientMock.id);
    expect(createWalletSpy).toHaveBeenCalledWith({
      clientId: clientMock.id,
      balance: 50.0,
    });
    expect(sendEmailSpy).toHaveBeenCalled();
    expect(wallet.balance).toBe(50.0);
  });
});
