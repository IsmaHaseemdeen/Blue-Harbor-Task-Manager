
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Bootstraps and starts the NestJS application.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allows requests from our Next.js frontend.
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  });

  // Validates incoming API data and rejects unknown fields.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Starts the backend on port 3001.
  await app.listen(Number(process.env.PORT ?? 3001));
}

void bootstrap();
