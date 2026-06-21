import { Global, Module } from '@nestjs/common';
import mailConfig from 'src/common/config/mail.config';
import { MailPort } from './mail.port';
import { ResendMailAdapter } from './resend-mail.adapter';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [
    {
      provide: MailPort,
      useClass: ResendMailAdapter,
    },
  ],
  exports: [MailPort],
})
export class MailModule {}
