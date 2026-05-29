import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { UsersController } from './presentation/http/users.controller';
import { HashingModule } from 'src/iam/infrastructure/hashing/hashing.module';
import { UserFactory } from './domain/factories/user.factory';
import { UserResponseMapper } from './presentation/http/mappers/user-response.mapper';
import { CaslModule } from 'src/iam/infrastructure/authorization/casl/casl.module';
import { UsersService } from './application/users.service';

@Global()
@Module({
  imports: [HashingModule, CaslModule],
  controllers: [UsersController],
  providers: [UsersService, UserFactory, UserResponseMapper],
  exports: [UsersService, UserFactory, UserResponseMapper],
})
export class UsersModule {
  static withInfrastructure(
    infrastructureModule: Type | DynamicModule,
  ): DynamicModule {
    return {
      module: UsersModule,
      imports: [infrastructureModule],
      exports: [infrastructureModule],
    };
  }
}
