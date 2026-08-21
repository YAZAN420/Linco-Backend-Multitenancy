export class DomainException extends Error {
  constructor(
    message: string,
    public readonly translationArgs?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
