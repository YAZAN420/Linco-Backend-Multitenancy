import { Injectable } from '@nestjs/common';
import { Course } from '../course';
import { v7 as uuidv7 } from 'uuid';
import { CourseVisibility } from '../enums/course-visibility.enum';
import { Price } from '../value-objects/price.vo';
import { Title } from '../value-objects/title.vo';

@Injectable()
export class CourseFactory {
  public createNew(
    title: string,
    visibility: CourseVisibility,
    authorDemoId: string,
    price?: number | null,
  ): Course {
    const now = new Date();
    const titleVo = Title.create(title);
    const priceVo = Price.create(price ?? null);
    return new Course(uuidv7(), {
      title: titleVo,
      visibility,
      price: priceVo,
      authorDemoId: authorDemoId ?? null,
      sections: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
