import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { UsersController } from './presentation/http/users.controller';
import { HashingModule } from 'src/iam/infrastructure/hashing/hashing.module';
import { CaslModule } from 'src/iam/infrastructure/authorization/casl/casl.module';
import { UserFactory } from './domain/factories/user.factory';
import { UsersQueryService } from './application/users-query.service';
import { UsersCommandService } from './application/users-command.service';
import { UserResponseMapper } from './presentation/http/mappers/user-response.mapper';

@Global()
@Module({
  imports: [HashingModule, CaslModule],
  controllers: [UsersController],
  providers: [
    UsersQueryService,
    UsersCommandService,
    UserFactory,
    UserResponseMapper,
  ],
  exports: [
    UsersQueryService,
    UsersCommandService,
    UserFactory,
    UserResponseMapper,
  ],
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
