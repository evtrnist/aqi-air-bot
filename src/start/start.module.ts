import { Module } from '@nestjs/common';
import { StartWizard } from './start.scene';

@Module({
  providers: [StartWizard],
})
export class StartModule {}
