import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

import { InquiriesQueryService } from 'src/inquiries/application/inquiries-query.service';

import { InquiryResponseMapper } from './mappers/inquiry-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';

@ApiTags('Inquiry')
@UseGuards(DemoRolesGuard)
@Controller('inquiries')
export class InquiriesQueryController {
  constructor(
    private readonly inquiryQueryService: InquiriesQueryService,
    private readonly inquiryResponseMapper: InquiryResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @ActiveDemoMember('demoId') demoId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const inquiries = await this.inquiryQueryService.findAllCursor(
      options,
      demoId,
    );

    return {
      message: 'messages.INQUIRIES_FETCHED_SUCCESSFULLY',
      data: this.inquiryResponseMapper.toResponseManyFromPrisma(inquiries.data),
      meta: inquiries.meta,
    };
  }

  @Get(':inquiryId')
  async findOne(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('inquiryId') inquiryId: string,
  ) {
    const inquiry = await this.inquiryQueryService.findById(inquiryId, demoId);

    return {
      message: 'messages.INQUIRY_RETRIEVED_SUCCESSFULLY',
      data: this.inquiryResponseMapper.toResponseFromPrisma(inquiry),
    };
  }

  @Get('cursor/me')
  async findAllForMe(
    @ActiveDemoMember() demoMember: ActiveDemoMemberData,
    @Query() options: CursorPageOptionsDto,
  ) {
    const inquiries = await this.inquiryQueryService.findAllForMe(
      demoMember.demoId,
      demoMember.id,
      options,
    );

    return {
      message: 'messages.INQUIRIES_FETCHED_SUCCESSFULLY',
      data: this.inquiryResponseMapper.toResponseManyFromPrisma(inquiries.data),
      meta: inquiries.meta,
    };
  }
}
