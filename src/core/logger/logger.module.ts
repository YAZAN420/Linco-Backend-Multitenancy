import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { ConfigType } from '@nestjs/config';
import appConfig from 'src/common/config/app.config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (Configuration: ConfigType<typeof appConfig>) => {
        const isProduction = Configuration.environment === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'info' : 'debug',
            transport: isProduction
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                  },
                },
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
