import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ApiService } from './api-service';

@Module({
  imports: [HttpModule],
  providers: [ApiService],
})
export class ApiModule {}
