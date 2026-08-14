import { IsString, IsNotEmpty, IsArray, ArrayMaxSize } from 'class-validator';

export class GenerateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;
}

export class GenerateMultipleUploadUrlsDto {
  @IsArray()
  @ArrayMaxSize(7, {
    message: 'errors.CANT_UPLOAD_MORE_THAN_7_FILES_AT_A_TIME',
  })
  @IsString({ each: true })
  files!: string[];
}
