export const IAM_CONSTANTS = {
  MAIL_QUEUE: 'mail-queue',
  MAIL_RETRY_ATTEMPTS: 5,
  MAIL_RETRY_DELAY_MS: 5_000,
  TOKEN_BYTES: 32,
  RESET_TOKEN_EXPIRY_MS: 3_600_000,
} as const;

export const MAIL_JOBS = {
  SEND_VERIFICATION_EMAIL: 'send-verification-email',
  SEND_PASSWORD_RESET_EMAIL: 'send-password-reset-email',
} as const;
