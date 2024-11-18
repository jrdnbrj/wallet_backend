import Wallet from "../models/Wallet";

export default class WalletRepository {
  public findWalletByClientId(clientId: number): Promise<Wallet | null> {
    return Wallet.findOne({ where: { clientId } });
  }

  public async updateWalletBalance(
    walletId: number,
    newBalance: number
  ): Promise<Wallet> {
    const wallet = await Wallet.findByPk(walletId);
    if (!wallet) throw new Error("Wallet not found");
    wallet.balance = newBalance;
    return wallet.save();
  }
}
