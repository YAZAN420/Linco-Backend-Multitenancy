export interface MailJobData {
  email: string;
  token: string;
}

export interface EnqueueMailOptions {
  priority?: number;
}
