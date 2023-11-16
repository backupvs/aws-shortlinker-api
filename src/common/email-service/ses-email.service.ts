import { IEmailService } from './email.service.interface';
import {
  Body,
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

export class SesEmailService implements IEmailService {
  private readonly client: SESClient;

  constructor(private readonly senderEmail: string) {
    this.client = new SESClient({ region: process.env.REGION });
  }

  async sendMessage(
    to: string,
    message: string,
    type: 'text' | 'html',
    subject?: string
  ): Promise<void> {
    const contentType = type === 'html' ? 'Html' : 'Text';

    const body: Body = {
      [contentType]: {
        Data: message,
      },
    };

    const params: SendEmailCommandInput = {
      Source: this.senderEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: body,
      },
    };

    if (process.env.IS_OFFLINE) {
      console.log(`Imitating of sending letter to ${to}`, { body });
      return;
    }

    await this.client.send(new SendEmailCommand(params));
  }
}
