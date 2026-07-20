import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

import { InquiryResponseMapper } from './mappers/inquiry-response.mapper';
import { InquiriesCommandService } from 'src/inquiries/application/inquiries-command.service';
import { InquiriesQueryService } from 'src/inquiries/application/inquiries-query.service';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@ApiTags('Inquiry')
@Controller('demos/:demoId/inquiries')
export class InquiriesCommandController {
  constructor(
    private readonly inquiryCommandService: InquiriesCommandService,
    private readonly inquiryQueryService: InquiriesQueryService,
    private readonly inquiryResponseMapper: InquiryResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: CreateInquiryDto,
    @Param('demoId') demoId: string,
  ) {
    const createdInquiry = await this.inquiryCommandService.create(
      dto,
      demoId,
      user.id,
    );
    const inquiry = await this.inquiryQueryService.findById(
      createdInquiry.id,
      demoId,
    );
    return {
      message: 'Inquiry created successfully',
      data: this.inquiryResponseMapper.toResponseFromPrisma(inquiry),
    };
  }

  @Patch(':inquiryId')
  async update(
    @Param('inquiryId') inquiryId: string,
    @Body() dto: UpdateInquiryDto,
    @Param('demoId') demoId: string,
  ) {
    const updatedInquiry = await this.inquiryCommandService.update(
      inquiryId,
      dto,
      demoId,
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
    @Param('inquiryId') inquiryId: string,
    @Param('demoId') demoId: string,
  ) {
    await this.inquiryCommandService.remove(inquiryId, demoId);

    return {
      message: 'Inquiry deleted successfully',
      data: null,
    };
  }
}
