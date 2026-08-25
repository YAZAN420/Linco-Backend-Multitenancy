export class CoursePublishedEvent {
  constructor(
    public readonly courseId: string,
    public readonly courseTitle: string,
  ) {}
}
