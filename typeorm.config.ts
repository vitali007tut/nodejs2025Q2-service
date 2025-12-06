import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './src/users/entities/user.entity';
import { Artist } from './src/artists/entities/artist.entity';
import { Album } from './src/albums/entities/album.entity';
import { Track } from './src/tracks/entities/track.entity';
import {
  FavoriteArtist,
  FavoriteAlbum,
  FavoriteTrack,
} from './src/favorites/entities/favorites.entity';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'home_library',
  entities: [
    User,
    Artist,
    Album,
    Track,
    FavoriteArtist,
    FavoriteAlbum,
    FavoriteTrack,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
