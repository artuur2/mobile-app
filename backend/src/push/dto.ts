import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const platforms = ['android', 'ios'] as const;
const states = ['stress', 'focus', 'sleep', 'energy', 'love', 'anxiety'] as const;

export class RegisterPushDeviceDto {
  @ApiProperty({ example: 'fcm_device_token_xxx' })
  @IsString()
  @MinLength(20)
  @MaxLength(4096)
  token!: string;

  @ApiProperty({ enum: platforms })
  @IsIn(platforms)
  platform!: (typeof platforms)[number];

  @ApiPropertyOptional({ example: 'Europe/Moscow' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  timezone?: string;

  @ApiPropertyOptional({ example: 'ru-RU' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  locale?: string;
}

export class NextRetentionCampaignQueryDto {
  @ApiPropertyOptional({ enum: states })
  @IsOptional()
  @IsIn(states)
  state?: (typeof states)[number];
}
