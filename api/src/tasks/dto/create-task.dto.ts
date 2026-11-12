
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '@prisma/client';

// Validates the data received when creating a task.
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
