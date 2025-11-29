import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as uuidValidate } from 'uuid';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  constructor(private readonly tracksService: TracksService) {}

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    const artist = this.artists.find((a) => a.id === id);
    if (!artist) {
      throw new NotFoundException('Artist was not found');
    }

    return artist;
  }

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: randomUUID(),
      name: createArtistDto.name,
      grammy: createArtistDto.grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist was not found');
    }

    const artist = this.artists[artistIndex];
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;

    return artist;
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    const artistIndex = this.artists.findIndex((a) => a.id === id);
    if (artistIndex === -1) {
      throw new NotFoundException('Artist was not found');
    }

    // Update tracks: set artistId to null for tracks with this artist
    this.tracksService.removeArtistReference(id);

    // TODO: Update albums when Albums module is implemented
    // TODO: Remove from favorites when Favorites module is implemented

    this.artists.splice(artistIndex, 1);
  }
}
