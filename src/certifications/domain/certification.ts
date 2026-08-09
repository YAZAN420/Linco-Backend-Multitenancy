import { CertificationProps } from './interfaces/certification.props';

export class Certification {
  constructor(
    public readonly id: string,
    private readonly props: CertificationProps,
  ) {}

  get courseId(): string {
    return this.props.courseId;
  }
  get demoMemberId(): string {
    return this.props.demoMemberId;
  }
  get score(): number {
    return this.props.score;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
