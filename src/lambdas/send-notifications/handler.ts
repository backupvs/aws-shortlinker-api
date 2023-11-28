import { SQSHandler } from 'aws-lambda';
import { EmailNotificationsFormatter } from '@common/email-notifications-formatter/email-notifications-formatter';
import { IEmailService } from '@common/email-service/email.service.interface';
import { SesEmailService } from '@common/email-service/ses-email.service';
import { SqsQueue } from 'src/sqs-queue/sqs.queue';

const sqsQueue: SqsQueue = new SqsQueue(process.env.NOTIFICATIONS_QUEUE_URL);
const emailService: IEmailService = new SesEmailService(process.env.SES_SENDER_EMAIL);
const emailNotificationsFormatter = new EmailNotificationsFormatter();

export const sendNotifications: SQSHandler = async (event) => {
  const promises = event.Records.map(async (record) => {
    try {
      const { type, email, params } = JSON.parse(record.body);
      const formatterdMessage = emailNotificationsFormatter.format(type, params);

      return emailService.sendMessage(
        email,
        formatterdMessage.message,
        formatterdMessage.contentType,
        formatterdMessage.subject
      );
    } catch (err) {
      console.error(err);
    } finally {
      await sqsQueue.delete(record.receiptHandle);
    }
  });

  await Promise.all(promises);
};

export const main = sendNotifications;
