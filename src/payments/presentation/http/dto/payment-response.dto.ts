import { PaymentType } from 'src/payments/domain/enums/payment-type.enum';

export class PaymentResponseDto {
  constructor(
    readonly id: string,
    readonly amount: number,
    readonly currency: string,
    readonly status: string,
    readonly type: PaymentType,
    readonly plan: string | undefined,
    readonly demoId: string | undefined,
    readonly courseId: string | undefined,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
