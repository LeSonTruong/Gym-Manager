import {join} from 'node:path';
import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {ConfigService} from '@nestjs/config';
import {ConfigKey} from 'src/config/config-key.enum';
import {EmailService} from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>(ConfigKey.MAIL_HOST),
          port: configService.getOrThrow<number>(ConfigKey.MAIL_PORT),
          auth:
            configService.get<string>(ConfigKey.MAIL_USER) && configService.get<string>(ConfigKey.MAIL_PASS)
              ? {
                  user: configService.get<string>(ConfigKey.MAIL_USER),
                  pass: configService.get<string>(ConfigKey.MAIL_PASS),
                }
              : undefined,
        },
        template: {
          // eslint-disable-next-line unicorn/prefer-module
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
