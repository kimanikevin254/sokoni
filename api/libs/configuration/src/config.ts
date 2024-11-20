import { registerAs } from '@nestjs/config';
import { type DatabaseType } from 'typeorm';

interface Config {
  db: {
    type: DatabaseType;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  rmq: {
    user: string;
    pass: string;
    port: number;
    host: string;
    uri: string;
  };
  queues: {
    user: string;
    notification: string;
  };
  app: {
    name: string;
  };
  linksTtl: {
    verificationLink: number;
    passwordResetLink: number;
  };
  mail: {
    mailgunKey: string;
    mailgunDomain: string;
    from: string;
  };
  frontend: {
    emailVerificationLink: string;
    passwordResetLink: string;
  };
}

export default registerAs<Config>('config', () => ({
  db: {
    type: process.env.DB_TYPE as DatabaseType,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  rmq: {
    user: process.env.RABBITMQ_DEFAULT_USER,
    pass: process.env.RABBITMQ_DEFAULT_PASS,
    port: parseInt(process.env.RABBITMQ_PORT),
    host: process.env.RABBITMQ_HOST,
    uri: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}`,
  },
  queues: {
    user: process.env.RABBITMQ_USER_QUEUE,
    notification: process.env.RABBITMQ_NOTIFICATION_QUEUE,
  },
  app: {
    name: process.env.APP_NAME,
  },
  linksTtl: {
    verificationLink: parseInt(process.env.EMAIL_VERIFICATION_LINK_TTL_MINUTES),
    passwordResetLink: parseInt(process.env.PASSWORD_RESET_LINK_TTL_MINUTES),
  },
  mail: {
    mailgunKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    from: process.env.MAIL_FROM,
  },
  frontend: {
    emailVerificationLink: process.env.FRONTEND_APP_EMAIL_VERIFICATION_LINK,
    passwordResetLink: process.env.FRONTEND_APP_PASSWORD_RESET_LINK,
  },
}));
