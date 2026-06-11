import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Section } from '../section';
import { CreateSectionInput } from 'src/courses/application/interfaces/create-section-input.interface';

@Injectable()
export class SectionFactory {
  public createNew(courseId: string, input: CreateSectionInput): Section {
    const now = new Date();
    return new Section(uuidv7(), {
      title: input.title,
      order: input.order,
      courseId: courseId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
