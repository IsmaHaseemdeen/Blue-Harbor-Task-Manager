
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  // LLM: Retrieves all tasks, newest first.
  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // LLM: Retrieves a task by ID or returns 404.
  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  // LLM: Creates a task after DTO validation.
  async create(dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        dueDate: dto.dueDate
          ? new Date(dto.dueDate)
          : undefined,
      },
    });
  }

  // LLM: Updates provided fields of an existing task.
  async update(id: number, dto: UpdateTaskDto) {
    const data: Prisma.TaskUpdateInput = {
      ...dto,
      dueDate:
        dto.dueDate === null
          ? null
          : dto.dueDate
            ? new Date(dto.dueDate)
            : undefined,
    };

    try {
      return await this.prisma.task.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleNotFound(error, id);
    }
  }

  // LLM: Deletes a task and returns a success message.
  async remove(id: number) {
    try {
      await this.prisma.task.delete({
        where: { id },
      });

      return { message: 'Task deleted successfully' };
    } catch (error) {
      this.handleNotFound(error, id);
    }
  }

  // LLM: Converts missing database records into HTTP 404 errors.
  private handleNotFound(error: unknown, id: number): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    throw error;
  }
}
