import { randomUUID } from 'node:crypto';
import { CreateUserDto, SignInDto } from './dto.types';
import { UsersRepository } from '../../database/repositories/users.repository';
import { HttpCodes } from '../../libs/http-codes.enum';
import HttpError from '../../errors/HttpError';
import { User } from './user.entity';
import { IHashService } from 'src/common/hash-service/hash.service.interface';
import { IJwtService } from 'src/common/token-service/jwt.service.interface';

export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashService: IHashService,
    private readonly jsonTokenService: IJwtService
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findByEmail(createUserDto.email);

    if (user) {
      throw new HttpError(HttpCodes.Conflict, 'User with given email already exist');
    }

    const newUser = new User(
      randomUUID({ disableEntropyCache: true }),
      createUserDto.email,
      await this.hashService.hash(createUserDto.password)
    );

    await this.usersRepository.create(newUser);
    const token = await this.jsonTokenService.createToken(
      { userId: newUser.userId },
      process.env.PUBLIC_KEY
    );

    return token;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findByEmail(signInDto.email);

    const isCorrectCredentials =
      user && (await this.hashService.compare(signInDto.password, user.password));

    if (!isCorrectCredentials) {
      throw new HttpError(HttpCodes.Unauthorized, 'Email or password is not correct');
    }

    const token = await this.jsonTokenService.createToken(
      { userId: user.userId },
      process.env.PUBLIC_KEY
    );

    return token;
  }
}
