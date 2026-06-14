import { IsOptional, IsString } from 'class-validator';
import { UpdateDemoInput } from 'src/demos/application/interfaces/update-demo-input.interface';

export class UpdateDemoDto implements UpdateDemoInput {
  @IsOptional()
  @IsString()
  name?: string;
}
