import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class VerifyGooglePurchaseDto {
  @ApiProperty({ example: 'premium_token_123' })
  @IsString()
  @MinLength(8)
  purchaseToken!: string;
}
