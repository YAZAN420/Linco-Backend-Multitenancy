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
    demoId: string,
    description: string,
    imagePath: string,
    price: number,
    tagIds: string[] = [],
  ): Course {
    const now = new Date();
    const titleVo = Title.create(title);
    const priceVo = Price.create(price);
    return new Course(uuidv7(), {
      title: titleVo,
      visibility,
      imagePath,
      description,
      tagIds,
      price: priceVo,
      demoId: demoId ?? null,
      sections: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
