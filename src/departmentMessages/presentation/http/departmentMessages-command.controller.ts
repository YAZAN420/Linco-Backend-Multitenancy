import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { DepartmentMessagesCommandService } from 'src/departmentMessages/application/departmentMessages-command.service';

@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('departmentMessages')
export class DepartmentMessagesCommandController {
  constructor(
    private readonly departmentMessageCommandService: DepartmentMessagesCommandService,
  ) {}

  @Post('upload-url')
  @HttpCode(HttpStatus.OK)
  async generateUrl(@Body() dto: GenerateUploadUrlDto) {
    return this.departmentMessageCommandService.generateAttachmentUrl(
      dto.fileName,
    );
  }
}
