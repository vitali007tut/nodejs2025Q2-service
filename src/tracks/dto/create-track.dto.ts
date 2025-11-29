import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((o) => o.artistId !== null && o.artistId !== undefined)
  @IsUUID()
  artistId?: string | null;

  @ValidateIf((o) => o.albumId !== null && o.albumId !== undefined)
  @IsUUID()
  albumId?: string | null;

  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
