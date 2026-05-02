// create-producto.dto.ts
import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateProductoDto {
    @IsString()
    nombre: string;

    @IsNumber()
    precioReferencia: number;

    @IsNumber()
    stockActual: number;

    @IsString()
    unidadMedida: string;

    @IsOptional()
    @IsString()
    imagenUrl?: string;

    @IsNumber()
    categoriaId: number;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}