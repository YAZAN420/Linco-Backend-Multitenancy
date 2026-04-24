export const MAIL_CONSTANTS = {
  QUEUE_NAME: 'mail-queue',
  RETRY_ATTEMPTS: 5,
  RETRY_DELAY_MS: 5_000,
} as const;

export const MAIL_JOBS = {
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
  SEND_PASSWORD_RESET_EMAIL: 'send-password-reset-email',
} as const;
