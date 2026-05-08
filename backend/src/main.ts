import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function iniciar() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('ERP Du Jojo API')
    .setDescription('API do sistema de gestão integrada ERP Du Jojo')
    .setVersion('1.0')
    .build();

  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documento);

  const porta = process.env.PORT ?? 3001;
  await app.listen(porta);
}

iniciar();
