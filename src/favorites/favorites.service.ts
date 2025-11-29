import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { validate as uuidValidate } from 'uuid';
import { Favorites } from './entities/favorites.entity';
import { FavoritesResponse } from './dto/favorites-response.dto';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };

  constructor(
    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,
  ) {}

  findAll(): FavoritesResponse {
    const artists = this.favorites.artists
      .map((id) => {
        try {
          return this.artistsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((artist) => artist !== null);

    const albums = this.favorites.albums
      .map((id) => {
        try {
          return this.albumsService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((album) => album !== null);

    const tracks = this.favorites.tracks
      .map((id) => {
        try {
          return this.tracksService.findOne(id);
        } catch {
          return null;
        }
      })
      .filter((track) => track !== null);

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    // Check if track exists
    try {
      this.tracksService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Track with id doesn't exist");
      }
      throw error;
    }

    // Add to favorites if not already there
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('trackId is invalid (not uuid)');
    }

    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track was not found');
    }

    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('albumId is invalid (not uuid)');
    }

    // Check if album exists
    try {
      this.albumsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Album with id doesn't exist");
      }
      throw error;
    }

    // Add to favorites if not already there
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('albumId is invalid (not uuid)');
    }

    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album was not found');
    }

    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    // Check if artist exists
    try {
      this.artistsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnprocessableEntityException("Artist with id doesn't exist");
      }
      throw error;
    }

    // Add to favorites if not already there
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtist(id: string): void {
    if (!uuidValidate(id)) {
      throw new BadRequestException('artistId is invalid (not uuid)');
    }

    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist was not found');
    }

    this.favorites.artists.splice(index, 1);
  }

  // Methods to be called when entities are deleted
  removeTrackReference(id: string): void {
    const index = this.favorites.tracks.indexOf(id);
    if (index !== -1) {
      this.favorites.tracks.splice(index, 1);
    }
  }

  removeAlbumReference(id: string): void {
    const index = this.favorites.albums.indexOf(id);
    if (index !== -1) {
      this.favorites.albums.splice(index, 1);
    }
  }

  removeArtistReference(id: string): void {
    const index = this.favorites.artists.indexOf(id);
    if (index !== -1) {
      this.favorites.artists.splice(index, 1);
    }
  }
}
