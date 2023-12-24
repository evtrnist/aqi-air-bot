import { Module } from '@nestjs/common';
import { StartWizard } from './start.scene';
import { UsersModule } from 'src/users/users.module';
import { ApiModule } from 'src/api/api.module';

@Module({
  imports: [UsersModule, ApiModule],
  providers: [StartWizard],
})
export class StartModule {}
