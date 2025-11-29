import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const track = this.tracks.find((t) => t.id === id);
    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    return track;
  }

  create(createTrackDto: CreateTrackDto): Track {
    const newTrack: Track = {
      id: randomUUID(),
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    };

    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const trackIndex = this.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track was not found');
    }

    const track = this.tracks[trackIndex];
    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId ?? null;
    track.albumId = updateTrackDto.albumId ?? null;
    track.duration = updateTrackDto.duration;

    return track;
  }

  remove(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const trackIndex = this.tracks.findIndex((t) => t.id === id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track was not found');
    }

    // Remove from favorites
    this.favoritesService.removeTrackReference(id);

    this.tracks.splice(trackIndex, 1);
  }

  removeArtistReference(artistId: string): void {
    this.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }

  removeAlbumReference(albumId: string): void {
    this.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
}
