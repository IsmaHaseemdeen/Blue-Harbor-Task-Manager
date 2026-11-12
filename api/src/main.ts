
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Bootstraps and starts the NestJS application.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allows the Next.js frontend to communicate with the API.
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  });

  // Starts the backend on port 3001 by default.
  await app.listen(Number(process.env.PORT ?? 3001));
}

void bootstrap();
