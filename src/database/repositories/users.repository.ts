import {
  PutCommand,
  PutCommandInput,
  QueryCommandInput,
  QueryCommand,
  GetCommandInput,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';
import { dbClient } from '../dynamo-db';
import { User } from '../../resources/auth/user.entity';

export class UsersRepository {
  private readonly usersTableName = process.env.USERS_TABLE;

  async create(user: User): Promise<Omit<User, 'password'>> {
    const params: PutCommandInput = {
      TableName: this.usersTableName,
      Item: { ...user },
    };

    await dbClient.send(new PutCommand(params));
    const { password, ...result } = user;

    return result;
  }

  async findById(id: string): Promise<User | null> {
    const params: GetCommandInput = {
      TableName: this.usersTableName,
      Key: {
        userId: id,
      },
    };

    const result = await dbClient.send(new GetCommand(params));

    return result.Item ? (result.Item as User) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const params: QueryCommandInput = {
      TableName: this.usersTableName,
      IndexName: 'emailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const result = await dbClient.send(new QueryCommand(params));

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as User;
    }

    return null;
  }
}
