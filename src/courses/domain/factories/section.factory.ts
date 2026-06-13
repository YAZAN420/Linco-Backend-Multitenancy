import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Section } from '../section';
import { Title } from '../value-objects/title.vo';
import { SectionOrder } from '../value-objects/section-order.vo';

@Injectable()
export class SectionFactory {
  public createNew(courseId: string, title: string, order: number): Section {
    const now = new Date();
    const titleVo = Title.create(title);
    const orderVo = SectionOrder.create(order);
    return new Section(uuidv7(), {
      title: titleVo,
      order: orderVo,
      courseId: courseId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
