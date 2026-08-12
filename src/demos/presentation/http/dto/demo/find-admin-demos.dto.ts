import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/common/dtos/pagination/offset/page-options.dto';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

export class FindAdminDemosDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;
}
