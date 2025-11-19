import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client } from 'pg';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Client as ClientEntity } from './clients/client.entity';

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
  const rawOrigins = process.env.FRONTEND_URLS || "";
  const whitelist = rawOrigins.split(",").map((url) => url.trim());
  console.log("Allowed Origins:", whitelist)
  app.enableCors({
    origin: (origin, callback) => {
      // Allow server-to-server, mobile apps, Postman
      if (!origin) return callback(null, true);

      if (whitelist.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },   // your React/Vite frontend
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  });
  // ------------------------------------------
  // 3️⃣ Create Default Company (Workspace)
  // ------------------------------------------
  const clientRepo = app.get(getRepositoryToken(ClientEntity));

  const defaultCompanyName = "Cloud Flex Pvt Ltd";

  const exists = await clientRepo.findOne({
    where: { name: defaultCompanyName },
  });

  if (!exists) {
    await clientRepo.save(
      clientRepo.create({
        name: defaultCompanyName,
      })
    );
    console.log("🏢 Default company created:", defaultCompanyName);
  } else {
    console.log("🏢 Default company already exists");
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
