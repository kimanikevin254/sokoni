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
    user: process.env.RABBITMQ_AUTH_QUEUE,
  },
}));
