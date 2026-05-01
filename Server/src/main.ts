import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // 1. Prefijo global para las rutas (ej: localhost:3000/api/productos)
    app.setGlobalPrefix('api');

    // 2. Habilitar CORS para que tu Angular (puerto 4200) pueda hablar con NestJS (puerto 3000)
    app.enableCors();

    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
    // 3. Configurar validaciones automáticas para los DTOs
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(3000);
    console.log(`🚀 Servidor del Fruver corriendo en: http://localhost:3000/api`);
}
bootstrap();