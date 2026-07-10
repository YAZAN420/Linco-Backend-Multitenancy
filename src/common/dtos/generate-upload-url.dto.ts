import { IsString, IsNotEmpty, IsArray, ArrayMaxSize } from 'class-validator';

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}

export class GenerateMultipleUploadUrlsDto {
  @IsArray()
  @ArrayMaxSize(7, { message: 'Cant upload more than 7 files at a time' })
  @IsString({ each: true })
  files!: string[];
}
