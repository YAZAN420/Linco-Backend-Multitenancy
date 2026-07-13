import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiRagService } from './ai-rag.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [AiRagService],
  exports: [AiRagService],
})
export class AiRagModule {}
