import * as SibApiV3Sdk from "sib-api-v3-typescript";
import dotenv from "dotenv";
import { loadEmailTemplate } from "../utils/templateLoader";

dotenv.config();

export default class EmailService {
  private apiInstance: SibApiV3Sdk.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    this.apiInstance.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.SENDINBLUE_API_KEY || ""
    );
  }

  async sendEmail(
    to: string,
    subject: string,
    templatePath: string,
    variables: Record<string, string>
  ): Promise<void> {
    const content = loadEmailTemplate(templatePath, variables);

    const emailData = {
      sender: { name: "Wallet System", email: "www.jrdnbrj@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent: content,
    };

    try {
      await this.apiInstance.sendTransacEmail(emailData);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Email sending failed");
    }
  }
}
