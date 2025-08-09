import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.use((err, req, res, next) => {
    console.log('ERROR ', err.status);
    if (err.status === 413) {
      return res.status(413).json({
        statusCode: 413,
        message: 'File or image too large. Please upload a smaller file.',
      });
    }
    next(err);
  });

  app.useLogger(app.get(Logger));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
