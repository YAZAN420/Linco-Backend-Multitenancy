export type ExamAttemptEligibilityReason =
  'AVAILABLE' | 'PREVIOUS_EXAMS_NOT_PASSED' | 'ALREADY_PASSED';

export interface ExamAttemptEligibility {
  examId: string;
  canAttempt: boolean;
  reason: ExamAttemptEligibilityReason;
}
