import { SQSHandler } from 'aws-lambda';
import 'src/sqs-queue/sqs-queue-client';

export const sendNotifications: SQSHandler = async (event) => {
  // TODO send by SES
  event.Records.forEach((r) => {
    const { email, shortLinkId } = JSON.parse(r.body);

    console.log(
      `Send letter to ${email} that link with ID "${shortLinkId}" has been deactivated!`
    );
  });
};

export const main = sendNotifications;
