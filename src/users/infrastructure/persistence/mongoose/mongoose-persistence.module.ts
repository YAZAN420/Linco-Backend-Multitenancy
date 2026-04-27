import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { MongooseUserRepository } from './repositories/mongoose-user.repository';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { MongooseUserMapper } from './mappers/mongoose-user.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  providers: [
    MongooseUserMapper,
    UserFactory,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class MongooseUserPersistenceModule {}
