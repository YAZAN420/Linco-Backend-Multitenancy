import { Global, Module } from '@nestjs/common';
import { JitsiController } from './jitsi.controller';
import { JitsiService } from './jitsi.service';

@Global()
@Module({
  controllers: [JitsiController],
  providers: [JitsiService],
  exports: [JitsiService],
})
export class JitsiModule {}
