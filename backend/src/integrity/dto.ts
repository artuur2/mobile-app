import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

const providers = ['play_integrity', 'safetynet'] as const;

export class VerifyIntegrityDto {
  @ApiProperty({ enum: providers })
  @IsIn(providers)
  provider!: (typeof providers)[number];

  @ApiProperty({ example: true })
  @IsBoolean()
  basicIntegrity!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  deviceIntegrity!: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  strongIntegrity?: boolean;

  @ApiPropertyOptional({ example: 3, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  recentFailedAttempts?: number;

  @ApiPropertyOptional({ example: 'google-jws-token' })
  @IsOptional()
  @IsString()
  @MaxLength(4096)
  tokenSnippet?: string;
}
