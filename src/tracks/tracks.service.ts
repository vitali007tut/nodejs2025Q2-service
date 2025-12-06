import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as uuidValidate } from 'uuid';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    return track;
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = this.trackRepository.create({
      name: createTrackDto.name,
      artistId: createTrackDto.artistId ?? null,
      albumId: createTrackDto.albumId ?? null,
      duration: createTrackDto.duration,
    });

    return await this.trackRepository.save(newTrack);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId ?? null;
    track.albumId = updateTrackDto.albumId ?? null;
    track.duration = updateTrackDto.duration;

    return await this.trackRepository.save(track);
  }

  async remove(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) {
      throw new NotFoundException('Track was not found');
    }

    await this.favoritesService.removeTrackReference(id);

    await this.trackRepository.remove(track);
  }

  async removeArtistReference(artistId: string): Promise<void> {
    await this.trackRepository.update({ artistId }, { artistId: null });
  }

  async removeAlbumReference(albumId: string): Promise<void> {
    await this.trackRepository.update({ albumId }, { albumId: null });
  }
}
