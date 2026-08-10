import { Module } from '@nestjs/common';
import { DesignsService } from './application/designs.service';
import { DesignFileValidator } from './application/design-file.validator';
import { DesignsController } from './presentation/http/designs.controller';

@Module({
  controllers: [DesignsController],
  providers: [DesignsService, DesignFileValidator],
})
export class DesignsModule {}
