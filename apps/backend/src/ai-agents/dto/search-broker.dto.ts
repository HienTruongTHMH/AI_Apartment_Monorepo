import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  role!: 'user' | 'assistant';

  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class SearchBrokerDto {
  @IsString()
  @IsNotEmpty()
  query!: string;

  @IsString()
  @IsNotEmpty()
  tenant_id!: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  conversation_history?: ChatMessageDto[];

  @IsString()
  @IsOptional()
  audio_url?: string;
}
