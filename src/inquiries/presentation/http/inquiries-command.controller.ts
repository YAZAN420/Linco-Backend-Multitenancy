import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

import { InquiryResponseMapper } from './mappers/inquiry-response.mapper';
import { InquiriesCommandService } from 'src/inquiries/application/inquiries-command.service';
import { InquiriesQueryService } from 'src/inquiries/application/inquiries-query.service';
import { ApiTags } from '@nestjs/swagger';

import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('Inquiry')
@UseGuards(DemoRolesGuard)
@Controller('inquiries')
export class InquiriesCommandController {
  constructor(
    private readonly inquiryCommandService: InquiriesCommandService,
    private readonly inquiryQueryService: InquiriesQueryService,
    private readonly inquiryResponseMapper: InquiryResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveDemoMember() demoMember: ActiveDemoMemberData,
    @Body() dto: CreateInquiryDto,
  ) {
    const createdInquiry = await this.inquiryCommandService.create(
      dto,
      demoMember.demoId,
      demoMember.id,
    );
    const inquiry = await this.inquiryQueryService.findById(
      createdInquiry.id,
      demoMember.demoId,
    );
    return {
      message: 'Inquiry created successfully',
      data: this.inquiryResponseMapper.toResponseFromPrisma(inquiry),
    };
  }

  @Patch(':inquiryId')
  async update(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('inquiryId') inquiryId: string,
    @Body() dto: UpdateInquiryDto,
  ) {
    const updatedInquiry = await this.inquiryCommandService.update(
      demoId,
      inquiryId,
      dto,
    );
    const inquiry = await this.inquiryQueryService.findById(
      updatedInquiry.id,
      demoId,
    );

    return {
      message: 'Inquiry updated successfully',
      data: this.inquiryResponseMapper.toResponseFromPrisma(inquiry),
    };
  }

  @Delete(':inquiryId')
  async remove(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('inquiryId') inquiryId: string,
  ) {
    await this.inquiryCommandService.remove(demoId, inquiryId);

    return {
      message: 'Inquiry deleted successfully',
      data: null,
    };
  }
}
