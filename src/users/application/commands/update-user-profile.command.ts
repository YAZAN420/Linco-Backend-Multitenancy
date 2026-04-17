export class UpdateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly username?: string,
  ) {}
}
