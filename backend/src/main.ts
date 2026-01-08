import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // <-- Eklendi
import { join } from 'path'; // <-- Eklendi

async function bootstrap() {
  // NestExpressApplication tipini belirttik ki statik dosya ayarlarını yapabilelim
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // --- RESİMLERİ DIŞARI AÇ ---
  // '/uploads' klasöründeki dosyalara tarayıcıdan erişilebilsin.
  // Örn: http://localhost:3000/uploads/resim.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // ---------------------------

  const config = new DocumentBuilder()
    .setTitle('Etkinlig API')
    .setDescription('Etkinlik Yönetim Sistemi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();