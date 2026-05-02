import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
    @IsNotEmpty()
    @IsString()
    nombreCompleto: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    rol?: string; // Por defecto será 'cliente' en la entidad
}