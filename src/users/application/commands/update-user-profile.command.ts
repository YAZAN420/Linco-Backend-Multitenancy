export class UpdateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly birthDate?: Date,
    public readonly imagePath?: string | null,
  ) {}
}
