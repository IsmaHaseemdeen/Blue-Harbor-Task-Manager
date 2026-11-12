
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

// Groups task-related API functionality.
@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
