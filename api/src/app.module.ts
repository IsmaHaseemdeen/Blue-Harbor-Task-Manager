
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TasksModule } from './tasks/tasks.module';

// Root module that connects the application's features.
@Module({
  imports: [
    PrismaModule,
    TasksModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
