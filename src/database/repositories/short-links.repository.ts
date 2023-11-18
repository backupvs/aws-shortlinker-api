import {
  PutCommand,
  PutCommandInput,
  QueryCommandInput,
  QueryCommand,
  GetCommandInput,
  GetCommand,
  ScanCommand,
  ScanCommandInput,
  UpdateCommandInput,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { dbClient } from '../dynamo-db';
import { ShortLink } from '@resources/short-links/short-link.entity';

export class ShortLinksRepository {
  private readonly shortLinksTable = process.env.SHORT_LINKS_TABLE;

  async findExpiredActive() {
    const params: ScanCommandInput = {
      TableName: this.shortLinksTable,
      FilterExpression: 'expirationTime <= :currentTime and isActive = :active',
      ExpressionAttributeValues: {
        ':currentTime': Date.now(),
        ':active': true,
      },
    };

    const result = await dbClient.send(new ScanCommand(params));

    return result.Items as ShortLink[];
  }

  async create(shortLink: ShortLink) {
    const params: PutCommandInput = {
      TableName: this.shortLinksTable,
      Item: { ...shortLink },
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

  async incrementVisitsCounterById(id: string, increment: number = 1) {
    const params: UpdateCommandInput = {
      TableName: this.shortLinksTable,
      Key: {
        shortLinkId: id,
      },
      AttributeUpdates: {
        visitsCount: {
          Value: increment,
          Action: 'ADD',
        },
      },
    };

    return dbClient.send(new UpdateCommand(params));
  }

  async deactivateById(id: string) {
    const params: UpdateCommandInput = {
      TableName: this.shortLinksTable,
      Key: {
        shortLinkId: id,
      },
      AttributeUpdates: {
        isActive: {
          Value: false,
        },
      },
    };

    return dbClient.send(new UpdateCommand(params));
  }
}
