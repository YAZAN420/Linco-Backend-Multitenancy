import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import mailConfig from 'src/common/config/mail.config';
import { MailPort } from './mail.port';
import { Resend } from 'resend';

@Injectable()
export class ResendMailAdapter implements MailPort {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendMailAdapter.name);

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.resend = new Resend(this.mailConfiguration.resendApiKey);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = this.buildAppUrl(
      '/authentication/verify-email',
      token,
    );

    const html = `
      <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Welcome to Linco!</h1>
          </div>

          <div style="padding: 30px 25px; line-height: 1.6; text-align: center;">
            <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Verify Your Email Address</h2>
            <p style="color: #4b5563; font-size: 15px; margin-bottom: 30px;">
              Thank you for signing up! Please confirm your email address to activate your account and unlock all features.
            </p>

            <div style="margin: 35px 0;">
              <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); transition: background-color 0.2s;">
                Verify Email Address
              </a>
            </div>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px;">
              &copy; ${new Date().getFullYear()} Linco. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `;

    await this.sendViaResend(to, 'Verify your email address', html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = this.buildAppUrl('/authentication/reset-password', token);

    const html = `
      <div style="background-color: #f9fafb; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          
          <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Linco Support</h1>
          </div>

          <div style="padding: 30px 25px; line-height: 1.6; text-align: center;">
            <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
            <p style="color: #4b5563; font-size: 15px; margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to set a new password and regain access to your account.
            </p>

            <div style="margin: 35px 0;">
              <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 32px; font-weight: bold; text-decoration: none; border-radius: 8px; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2); transition: background-color 0.2s;">
                Reset Password
              </a>
            </div>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              If you did not request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px;">
              &copy; ${new Date().getFullYear()} Linco. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `;

    await this.sendViaResend(to, 'Password Reset Request', html);
  }

  private async sendViaResend(
    to: string,
    subject: string,
    htmlContent: string,
  ) {
    try {
      const data = await this.resend.emails.send({
        from: `Linco <${this.mailConfiguration.fromAddress}>`,
        to: [to],
        subject: subject,
        replyTo: 'yazanmahfooz8@gmail.com',
        html: htmlContent,
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      this.logger.log(
        `✅ Email sent successfully via Resend to ${to}. ID: ${data.data?.id}`,
      );
    } catch (error) {
      this.logger.error(`❌ Failed to send email via Resend to ${to}:`, error);
      throw error;
    }
  }

  private buildAppUrl(pathname: string, token: string): string {
    const url = new URL(pathname, this.mailConfiguration.appBaseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  }
}
