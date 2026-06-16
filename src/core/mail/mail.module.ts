import { Global, Module } from '@nestjs/common';
import mailConfig from 'src/common/config/mail.config';
import { MailPort } from './mail.port';
import { NodemailerAdapter } from './nodemailer.adapter';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forFeature(mailConfig)],
  providers: [
    {
      provide: MailPort,
      useClass: NodemailerAdapter,
    },
  ],
  exports: [MailPort],
})
export class MailModule {}
