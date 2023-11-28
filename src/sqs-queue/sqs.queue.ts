import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  DeleteMessageCommandInput,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

export class SqsQueue {
  private readonly client: SQSClient;
  private readonly queueUrl: string;

  constructor(queueUrl: string) {
    this.queueUrl = process.env.IS_OFFLINE ? this.getOfflineUrl(queueUrl) : queueUrl;

    this.client = new SQSClient({
      endpoint: this.queueUrl,
      region: process.env.REGION,
    });
  }

  async push(body: string) {
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: body,
    };
    const result = await this.client.send(new SendMessageCommand(params));

    return result.MessageId;
  }

  async delete(receiptHandle: string) {
    const params: DeleteMessageCommandInput = {
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    };

    await this.client.send(new DeleteMessageCommand(params));
  }

  private getOfflineUrl(queueUrl: string) {
    const url = new URL(queueUrl);
    return `http://0.0.0.0:9324${url.pathname}`;
  }
}
