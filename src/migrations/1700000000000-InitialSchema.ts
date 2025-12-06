import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "login" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "createdAt" bigint NOT NULL,
        "updatedAt" bigint NOT NULL,
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create artists table
    await queryRunner.query(`
      CREATE TABLE "artists" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "grammy" boolean NOT NULL DEFAULT false,
        CONSTRAINT "PK_artists" PRIMARY KEY ("id")
      )
    `);

    // Create albums table
    await queryRunner.query(`
      CREATE TABLE "albums" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "year" integer NOT NULL,
        "artistId" uuid,
        CONSTRAINT "PK_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_albums_artist" FOREIGN KEY ("artistId")
          REFERENCES "artists"("id") ON DELETE SET NULL
      )
    `);

    // Create tracks table
    await queryRunner.query(`
      CREATE TABLE "tracks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(255) NOT NULL,
        "artistId" uuid,
        "albumId" uuid,
        "duration" integer NOT NULL,
        CONSTRAINT "PK_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tracks_artist" FOREIGN KEY ("artistId")
          REFERENCES "artists"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_tracks_album" FOREIGN KEY ("albumId")
          REFERENCES "albums"("id") ON DELETE SET NULL
      )
    `);

    // Create favorite_artists table
    await queryRunner.query(`
      CREATE TABLE "favorite_artists" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "artistId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_artists" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_artists_artist" FOREIGN KEY ("artistId")
          REFERENCES "artists"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_favorite_artists_artistId" UNIQUE ("artistId")
      )
    `);

    // Create favorite_albums table
    await queryRunner.query(`
      CREATE TABLE "favorite_albums" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "albumId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_albums" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_albums_album" FOREIGN KEY ("albumId")
          REFERENCES "albums"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_favorite_albums_albumId" UNIQUE ("albumId")
      )
    `);

    // Create favorite_tracks table
    await queryRunner.query(`
      CREATE TABLE "favorite_tracks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "trackId" uuid NOT NULL,
        CONSTRAINT "PK_favorite_tracks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_favorite_tracks_track" FOREIGN KEY ("trackId")
          REFERENCES "tracks"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_favorite_tracks_trackId" UNIQUE ("trackId")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "favorite_tracks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favorite_albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "favorite_artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tracks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "albums"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "artists"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
