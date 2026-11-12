
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

// Root module that connects the application's features.
@Module({
  imports: [
    // Initializes the Prisma database integration.
    PrismaModule,
  ],

  controllers: [
    // Registers the API health-check endpoint.
    HealthController,
  ],
})
export class AppModule {}
