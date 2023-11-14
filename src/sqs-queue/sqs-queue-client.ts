import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';

export class SqsQueueClient {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor(queueUrl: string) {
    this.queueUrl = process.env.IS_OFFLINE
      ? this.getOfflineSqsQueueUrl(queueUrl)
      : queueUrl;

    this.client = new SQSClient({
      endpoint: this.queueUrl,
      region: process.env.REGION,
    });
  }

  async sendMessage(body: string, groupId: string) {
    const messageId = randomUUID({ disableEntropyCache: true });
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: body,
      MessageDeduplicationId: messageId,
      MessageGroupId: groupId,
    };
    const result = await this.client.send(new SendMessageCommand(params));

    return result.MessageId;
  }

  private getOfflineSqsQueueUrl(queueUrl: string) {
    const url = new URL(queueUrl);
    return `http://0.0.0.0:9324${url.pathname}`;
  }
}
