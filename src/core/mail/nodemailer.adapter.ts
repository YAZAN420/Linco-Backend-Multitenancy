import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import mailConfig from 'src/config/mail.config';
import * as nodemailer from 'nodemailer';
import { MailPort } from './mail.port';

@Injectable()
export class NodemailerAdapter implements MailPort {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(mailConfig.KEY)
    private readonly mailConfiguration: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.mailConfiguration.host,
      port: this.mailConfiguration.port,
      secure: this.mailConfiguration.port === 465,
      auth: {
        user: this.mailConfiguration.user,
        pass: this.mailConfiguration.pass,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const verificationUrl = this.buildAppUrl(
      '/authentication/verify-email',
      token,
    );

    await this.transporter.sendMail({
      from: `"Application Security" <${this.mailConfiguration.fromAddress}>`,
      to,
      subject: 'Verify your email address',
      html: `
        <h3>Welcome!</h3>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = this.buildAppUrl('/authentication/reset-password', token);

    await this.transporter.sendMail({
      from: `"Application Security" <${this.mailConfiguration.fromAddress}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <h3>Password Reset</h3>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  private buildAppUrl(pathname: string, token: string): string {
    const url = new URL(pathname, this.mailConfiguration.appBaseUrl);
    url.searchParams.set('token', token);
    return url.toString();
  }
}
