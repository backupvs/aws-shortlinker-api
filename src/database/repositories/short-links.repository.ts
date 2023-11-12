import {
  PutCommand,
  PutCommandInput,
  QueryCommandInput,
  QueryCommand,
  DeleteCommand,
  DeleteCommandInput,
  GetCommandInput,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { dbClient } from '../dynamo-db';
import { ShortLink } from 'src/resources/short-link/short-link.entity';

export class ShortLinksRepository {
  private readonly shortLinksTable = process.env.SHORT_LINKS_TABLE;

  async create(shortLink: ShortLink) {
    const params: PutCommandInput = {
      TableName: this.shortLinksTable,
      Item: shortLink,
    };

    await dbClient.send(new PutCommand(params));

    return shortLink;
  }

  async findById(id: string): Promise<ShortLink | null> {
    const params: GetCommandInput = {
      TableName: this.shortLinksTable,
      Key: {
        shortLinkId: id,
      },
    };

    const result = await dbClient.send(new GetCommand(params));

    return result.Item ? (result.Item as ShortLink) : null;
  }

  async findByOwnerId(ownerId: string): Promise<ShortLink[]> {
    const params: QueryCommandInput = {
      TableName: this.shortLinksTable,
      IndexName: 'ownerIdIndex',
      KeyConditionExpression: 'ownerId = :ownerId',
      ExpressionAttributeValues: {
        ':ownerId': ownerId,
      },
    };

    const result = await dbClient.send(new QueryCommand(params));

    return result.Items as ShortLink[];
  }

  async findByPathId(pathId: string): Promise<ShortLink | null> {
    const params: QueryCommandInput = {
      TableName: this.shortLinksTable,
      IndexName: 'pathIdIndex',
      KeyConditionExpression: 'pathId = :pathId',
      ExpressionAttributeValues: {
        ':pathId': pathId,
      },
    };

    const result = await dbClient.send(new QueryCommand(params));

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as ShortLink;
    }

    return null;
  }

  async deleteById(id: string) {
    const params: DeleteCommandInput = {
      TableName: this.shortLinksTable,
      Key: {
        shortLinkId: id,
      },
    };

    await dbClient.send(new DeleteCommand(params));

    return {
      shortLinkId: id,
    };
  }
}
