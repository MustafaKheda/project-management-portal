import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client } from 'pg';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create DB if it doesn't exist
  const dbName = process.env.DB_NAME || 'assignment';

  const pgClient = new Client({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'password',
    port: 5432,
    database: 'postgres', // always exists
  });

  await pgClient.connect();

  const res = await pgClient.query(
    `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
  );

  if (res.rowCount === 0) {
    console.log(`⚡ Database "${dbName}" not found. Creating...`);
    await pgClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database "${dbName}" created.`);
  }

  await pgClient.end();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // Add /api globally
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: "http://localhost:5173",   // your React/Vite frontend
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
