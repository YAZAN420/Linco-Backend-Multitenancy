import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/domain/user';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserDocument } from '../schemas/user.schema';
import {
  CursorPageDto,
  CursorPageMetaDto,
  CursorPageOptionsDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { MongooseUserMapper } from '../mappers/mongoose-user.mapper';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly mapper: MongooseUserMapper,
  ) {}

  async findAll(options: PageOptionsDto): Promise<PageDto<User>> {
    const docs = await this.userModel
      .find()
      .skip(options.skip)
      .limit(options.take)
      .lean()
      .exec();
    const usersDomain = docs.map((doc) => this.mapper.toDomain(doc));
    const itemCount = await this.userModel.countDocuments().exec();
    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: options,
    });
    return new PageDto(usersDomain, pageMetaDto);
  }

  async findAllCursor(
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<User>> {
    const { cursor, take } = options;

    let query = {};
    if (cursor) {
      query = { _id: { $lt: cursor } };
    }
    const docs = await this.userModel
      .find(query)
      .sort({ _id: -1 })
      .limit(take + 1)
      .exec();

    const hasNextPage = docs.length > take;

    if (hasNextPage) {
      docs.pop();
    }

    const endCursor =
      docs.length > 0 ? docs[docs.length - 1]._id.toString() : null;

    const usersDomain = docs.map((doc) => this.mapper.toDomain(doc));
    const meta = new CursorPageMetaDto(hasNextPage, endCursor);

    return new CursorPageDto(usersDomain, meta);
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
    return this.mapper.toDomain(doc);
  }
}
