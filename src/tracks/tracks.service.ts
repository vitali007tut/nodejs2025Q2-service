import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class TracksService {
  private tracks: Track[] = [];

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

    this.tracks.splice(trackIndex, 1);
  }
}
