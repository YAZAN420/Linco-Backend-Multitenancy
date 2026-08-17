export interface CreateOneTimeCheckoutParams {
  amount: number;
  currency: string;
  courseTitle: string;
  customerEmail: string;
  paymentId: string;
  courseId: string;
  userId: string;
}
