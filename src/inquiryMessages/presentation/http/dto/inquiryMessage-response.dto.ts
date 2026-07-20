export class InquiryMessageResponseDto {
  constructor(
    readonly id: string,
    readonly senderId: string,
    readonly inquiryId: string,
    readonly message: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
