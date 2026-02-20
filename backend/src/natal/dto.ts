import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

const focusAreas = ['general', 'love', 'career', 'energy'] as const;

export class GetNatalChartQueryDto {
  @ApiPropertyOptional({ enum: focusAreas, default: 'general' })
  @IsOptional()
  @IsIn(focusAreas)
  focus?: (typeof focusAreas)[number];
}
