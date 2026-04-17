import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserMapper } from '../../../shared/user.mapper';
import { UserDocument } from '../schemas/user.schema';
import { UserPersistenceData } from 'src/users/domain/user-persistence.interface';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mapper: UserMapper,
  ) {}

  async findAll(): Promise<User[]> {
    const docs = await this.userModel.find().lean().exec();
    return docs.map((doc) =>
      this.mapper.toDomain(doc as unknown as UserPersistenceData),
    );
  }

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    await this.userModel
      .findOneAndUpdate({ _id: data._id }, { $set: data }, { upsert: true })
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.findOneAndMap({ _id: id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneAndMap({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOneAndMap({ username });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return this.findOneAndMap({ emailVerificationToken: token });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return this.findOneAndMap({ passwordResetToken: token });
  }

  private async findOneAndMap(
    filter: Record<string, unknown>,
  ): Promise<User | null> {
    const doc = await this.userModel.findOne(filter).lean().exec();
    if (!doc) return null;
    return this.mapper.toDomain(doc as unknown as UserPersistenceData);
  }
}
