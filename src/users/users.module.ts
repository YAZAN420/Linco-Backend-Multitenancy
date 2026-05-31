import { DynamicModule, Global, Module, Type } from '@nestjs/common';
import { HashingModule } from 'src/iam/infrastructure/hashing/hashing.module';
import { UserFactory } from './domain/factories/user.factory';
import { UserResponseMapper } from './presentation/http/mappers/user-response.mapper';
import { CaslModule } from 'src/iam/infrastructure/authorization/casl/casl.module';
import { UsersCommandService } from './application/users-command.service';
import { UsersQueryService } from './application/users-query.service';
import { UsersCommandController } from './presentation/http/users-command.controller';
import { UsersQueryController } from './presentation/http/users-query.controller';

@Global()
@Module({
  imports: [HashingModule, CaslModule],
  controllers: [UsersCommandController, UsersQueryController],
  providers: [
    UsersCommandService,
    UsersQueryService,
    UserFactory,
    UserResponseMapper,
  ],
  exports: [
    UsersCommandService,
    UsersQueryService,
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
