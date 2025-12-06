import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '4000', 10);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const apiYamlPath =
    process.env.NODE_ENV === 'production'
      ? join(__dirname, '../doc/api.yaml')
      : join(process.cwd(), 'doc/api.yaml');
  const apiYamlContent = readFileSync(apiYamlPath, 'utf8');
  const apiDocument = parse(apiYamlContent);

  SwaggerModule.setup('doc', app, apiDocument);

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API documentation: http://localhost:${port}/doc`);
}
bootstrap();
