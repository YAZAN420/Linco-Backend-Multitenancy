import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import mailConfig from 'src/common/config/mail.config';
import * as nodemailer from 'nodemailer';
import { MailPort } from './mail.port';

@Injectable()
export class GmailApiAdapter implements MailPort {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.mailConfiguration.fromAddress,
        clientId: this.mailConfiguration.gmailClientId,
        clientSecret: this.mailConfiguration.gmailClientSecret,
        refreshToken: this.mailConfiguration.gmailRefreshToken,
      },
    });
  }

  private async sendEmailViaApi(
    to: string,
    subject: string,
    htmlContent: string,
  ) {
    try {
      await this.transporter.sendMail({
        from: `Linco <${this.mailConfiguration.fromAddress}>`,
        to,
        subject,
        html: htmlContent,
      });
      console.log(`✅ Email sent to ${to}`);
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(to: string, token: string) {
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

    await this.sendEmailViaApi(to, 'Verify your email address', html);
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = this.buildAppUrl('/authentication/reset-password', token);

    const html = `
      <h3>Password Reset</h3>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await this.sendEmailViaApi(to, 'Password Reset Request', html);
  }

  private buildAppUrl(pathname: string, token: string): string {
    const url = new URL(pathname, this.mailConfiguration.appBaseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  }
}
