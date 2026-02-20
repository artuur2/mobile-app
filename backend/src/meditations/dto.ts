import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

const states = ['stress', 'focus', 'sleep', 'energy', 'love', 'anxiety'] as const;

export class ListMeditationsQueryDto {
  @ApiPropertyOptional({ enum: states })
  @IsOptional()
  @IsIn(states)
  state?: (typeof states)[number];

  @ApiPropertyOptional({ minimum: 1, maximum: 20, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}
