import { SQSHandler } from 'aws-lambda';
import { EmailNotificationsFormatter } from 'src/common/email-notifications-formatter/email-notifications-formatter';
import { IEmailService } from 'src/common/email-service/email.service.interface';
import { SesEmailService } from 'src/common/email-service/ses-email.service';

const emailService: IEmailService = new SesEmailService(process.env.SES_SENDER_EMAIL);
const emailNotificationsFormatter = new EmailNotificationsFormatter();

export const sendNotifications: SQSHandler = async (event) => {
  const promises = event.Records.map(async (record) => {
    const { type, email, params } = JSON.parse(record.body);
    const formatterdMessage = emailNotificationsFormatter.format(type, params);

    return emailService.sendMessage(
      email,
      formatterdMessage.message,
      formatterdMessage.contentType,
      formatterdMessage.subject
    );
  });

  await Promise.all(promises);
};

export const main = sendNotifications;
