import { DomainException } from 'src/common/exceptions/domain.exception';

export class FilePath {
  private constructor(public readonly value: string) {}

  static create(path: string): FilePath {
    if (!path || path.trim().length === 0) {
      throw new DomainException('File path cannot be empty');
    }
    return new FilePath(path.trim());
  }

  static fromPersistence(path: string): FilePath {
    return new FilePath(path);
  }

  equals(other: FilePath): boolean {
    return this.value === other.value;
  }
}
