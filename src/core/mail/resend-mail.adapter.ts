import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import mailConfig from 'src/common/config/mail.config';
import { MailPort } from './mail.port';
import { Resend } from 'resend';

@Injectable()
export class ResendMailAdapter implements MailPort {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendMailAdapter.name);

  private readonly mascotImageUrl =
    'https://storage.lincolms.me/EmailPhoto.png';

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.resend = new Resend(this.mailConfiguration.resendApiKey);
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const verificationUrl = this.buildAppUrl('/verify-email', token);

    const html = `
      <div style="background-color: #f4f6f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border-top: 6px solid #1e3a8a;">
          
          <div style="padding: 40px 20px 10px; text-align: center;">
            <!-- صورة الحبار -->
            <img src="${this.mascotImageUrl}" alt="LinCo Mascot" width="120" style="display: block; margin: 0 auto 20px;" />
            <h1 style="color: #1e3a8a; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">Welcome to LinCo!</h1>
          </div>

          <div style="padding: 20px 30px 40px; line-height: 1.6; text-align: center;">
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
              Thank you for signing up! Please confirm your email address to activate your account and start your learning journey.
            </p>

            <div style="margin: 35px 0;">
              <a href="${verificationUrl}" style="background-color: #1e3a8a; color: #ffffff; padding: 14px 40px; font-weight: 600; text-decoration: none; border-radius: 30px; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(30, 58, 138, 0.2); transition: opacity 0.2s;">
                Verify Email Address
              </a>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
            </p>
            <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 12px;">
              &copy; ${new Date().getFullYear()} LinCo. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    `;

    await this.sendViaResend(to, 'Verify your email address', html);
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetUrl = this.buildAppUrl('/reset-password', token);

    const html = `
      <div style="background-color: #f4f6f9; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; direction: ltr; color: #1f2937;">
        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border-top: 6px solid #1e3a8a;">
          
          <div style="padding: 40px 20px 10px; text-align: center;">
            <!-- صورة الحبار -->
            <img src="${this.mascotImageUrl}" alt="LinCo Mascot" width="120" style="display: block; margin: 0 auto 20px;" />
            <h1 style="color: #1e3a8a; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Password Reset</h1>
          </div>

          <div style="padding: 20px 30px 40px; line-height: 1.6; text-align: center;">
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
              We received a request to reset your password. Click the button below to set a new password and regain access to your LinCo account.
            </p>

            <div style="margin: 35px 0;">
              <a href="${resetUrl}" style="background-color: #1e3a8a; color: #ffffff; padding: 14px 40px; font-weight: 600; text-decoration: none; border-radius: 30px; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(30, 58, 138, 0.2); transition: opacity 0.2s;">
                Reset Password
              </a>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              If you did not request this, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <p style="margin: 10px 0 0 0; color: #94a3b8; font-size: 12px;">
              &copy; ${new Date().getFullYear()} LinCo. All rights reserved.
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
