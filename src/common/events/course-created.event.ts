export class CourseCreatedEvent {
  constructor(
    public readonly demoId: string,
    public readonly courseId: string,
  ) {}
}
