import { Controller, Get } from '@nestjs/common';
import { ProcessService } from './process.service';

@Controller()
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @Get()
  heartbeat(): string {
    return this.processService.heartbeat();
  }
}
