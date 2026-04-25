import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleMobileSignInDto {
  @IsString()
  @IsNotEmpty()
  idToken!: string;
}
