
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Makes PrismaService accessible throughout the application.
@Global()
@Module({
  // Registers PrismaService for dependency injection.
  providers: [PrismaService],

  // Allows other modules to use PrismaService.
  exports: [PrismaService],
})
export class PrismaModule {}
