import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Section } from '../section';
import { CreateSectionInput } from 'src/courses/application/interfaces/create-section-input.interface';

@Injectable()
export class SectionFactory {
  public createNew(input: CreateSectionInput): Section {
    const now = new Date();
    return new Section(uuidv7(), {
      title: input.title,
      order: input.order,
      courseId: input.courseId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
