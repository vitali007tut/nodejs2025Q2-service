import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import { AppModule } from './app.module';
import { LoggingService } from './common/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT || '4000', 10);

  const loggingService = app.get(LoggingService);

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

  process.on('uncaughtException', (error: Error) => {
    loggingService.error(
      `Uncaught Exception: ${error.message}`,
      error.stack,
      'Bootstrap',
    );
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    const errorMessage =
      reason instanceof Error ? reason.message : String(reason);
    const errorStack = reason instanceof Error ? reason.stack : undefined;
    loggingService.error(
      `Unhandled Rejection: ${errorMessage}`,
      errorStack,
      'Bootstrap',
    );
  });

  await app.listen(port);
  loggingService.log(
    `🚀 Application is running on: http://localhost:${port}`,
    'Bootstrap',
  );
  loggingService.log(
    `📚 API documentation: http://localhost:${port}/doc`,
    'Bootstrap',
  );
}
bootstrap();
