
import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Makes the database client available through dependency injection.
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Connects to the database when NestJS starts.
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  // Closes the connection when NestJS shuts down.
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
