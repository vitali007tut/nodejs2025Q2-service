import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';
import {
  FavoriteArtist,
  FavoriteAlbum,
  FavoriteTrack,
} from './entities/favorites.entity';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoriteArtist)
    private readonly favoriteArtistRepository: Repository<FavoriteArtist>,
    @InjectRepository(FavoriteAlbum)
    private readonly favoriteAlbumRepository: Repository<FavoriteAlbum>,
    @InjectRepository(FavoriteTrack)
    private readonly favoriteTrackRepository: Repository<FavoriteTrack>,
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  async findAll(): Promise<FavoritesResponse> {
    const favoriteArtists = await this.favoriteArtistRepository.find({
      relations: ['artist'],
    });
    const favoriteAlbums = await this.favoriteAlbumRepository.find({
      relations: ['album'],
    });
    const favoriteTracks = await this.favoriteTrackRepository.find({
      relations: ['track'],
    });

    const artists = favoriteArtists
      .map((fa) => fa.artist)
      .filter((artist) => artist !== null);

    const albums = favoriteAlbums
      .map((fa) => fa.album)
      .filter((album) => album !== null);

    const tracks = favoriteTracks
      .map((ft) => ft.track)
      .filter((track) => track !== null);

    return {
      artists,
      albums,
      tracks,
    };
  }

  async addTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    try {
      await this.tracksService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Track with id doesn't exist");
      }
      throw error;
    }

    const existing = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });

    if (!existing) {
      const favoriteTrack = this.favoriteTrackRepository.create({
        trackId: id,
      });
      await this.favoriteTrackRepository.save(favoriteTrack);
    }
  }

  async removeTrack(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const favoriteTrack = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });

    if (!favoriteTrack) {
      throw new NotFoundException('Track was not found');
    }

    await this.favoriteTrackRepository.remove(favoriteTrack);
  }

  async addAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('albumId is invalid (not uuid)');
    }

    try {
      await this.albumsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Album with id doesn't exist");
      }
      throw error;
    }

    const existing = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });

    if (!existing) {
      const favoriteAlbum = this.favoriteAlbumRepository.create({
        albumId: id,
      });
      await this.favoriteAlbumRepository.save(favoriteAlbum);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('albumId is invalid (not uuid)');
    }

    const favoriteAlbum = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });

    if (!favoriteAlbum) {
      throw new NotFoundException('Album was not found');
    }

    await this.favoriteAlbumRepository.remove(favoriteAlbum);
  }

  async addArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    try {
      await this.artistsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Artist with id doesn't exist");
      }
      throw error;
    }

    const existing = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });

    if (!existing) {
      const favoriteArtist = this.favoriteArtistRepository.create({
        artistId: id,
      });
      await this.favoriteArtistRepository.save(favoriteArtist);
    }
  }

  async removeArtist(id: string): Promise<void> {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    const favoriteArtist = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });

    if (!favoriteArtist) {
      throw new NotFoundException('Artist was not found');
    }

    await this.favoriteArtistRepository.remove(favoriteArtist);
  }

  async removeTrackReference(id: string): Promise<void> {
    const favoriteTrack = await this.favoriteTrackRepository.findOne({
      where: { trackId: id },
    });

    if (favoriteTrack) {
      await this.favoriteTrackRepository.remove(favoriteTrack);
    }
  }

  async removeAlbumReference(id: string): Promise<void> {
    const favoriteAlbum = await this.favoriteAlbumRepository.findOne({
      where: { albumId: id },
    });

    if (favoriteAlbum) {
      await this.favoriteAlbumRepository.remove(favoriteAlbum);
    }
  }

  async removeArtistReference(id: string): Promise<void> {
    const favoriteArtist = await this.favoriteArtistRepository.findOne({
      where: { artistId: id },
    });

    if (favoriteArtist) {
      await this.favoriteArtistRepository.remove(favoriteArtist);
    }
  }
}
