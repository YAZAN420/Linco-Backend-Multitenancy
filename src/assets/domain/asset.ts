import { AccessMethod } from './enums/access-method.enum';
import { AssetProps } from './interfaces/asset.props';

export class Asset {
  constructor(
    public readonly id: string,
    private readonly props: AssetProps,
  ) {}

  get acquiredAt(): Date {
    return this.props.acquiredAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get demoId(): string {
    return this.props.demoId;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get accessMethod(): AccessMethod {
    return this.props.accessMethod;
  }

  updateAccessMethod(newAccessMethod: AccessMethod): void {
    if (this.props.accessMethod === newAccessMethod) return;
    this.props.accessMethod = newAccessMethod;
    this.props.updatedAt = new Date();
  }
}
