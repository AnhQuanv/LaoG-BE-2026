import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from 'core/filters/http-exception/http-exception.filter';
import { LoggingInterceptor } from 'core/interceptors/logging/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });

  redisClient.on('error', (err) => console.error('❌ Redis Error:', err));

  await redisClient.connect().catch((err) => {
    console.error('❌ Redis Connection Error:', err);
  });

  app.use(
    session({
      store: new RedisStore({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        client: redisClient as any,
        prefix: 'laog_sess:',
      }),
      secret: process.env.SESSION_SECRET || 'SECRET_KEY_REDIS',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Tạp Hóa Xịn API')
    .setDescription('Tài liệu API cho hệ thống quản lý bán hàng')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 10000);
}
bootstrap().catch((err) => {
  console.error('Lỗi khởi động server:', err);
});
