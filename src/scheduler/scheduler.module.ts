import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiModule } from 'src/api/api.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule, ApiModule],
})
export class SchedulerModule {}
