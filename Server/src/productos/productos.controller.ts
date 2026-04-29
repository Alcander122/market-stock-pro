import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as Express from 'express';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) { }

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
  // --- NUEVO MÉTODO PARA SUBIR IMAGEN ---
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      // CAMBIO: Guardar en una carpeta fuera de 'src'
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadFile(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    // Ahora la URL apuntará al servidor de NestJS (puerto 3000)
    const urlImagen = `http://localhost:3000/uploads/${file.filename}`;
    return this.productosService.update(+id, { imagenUrl: urlImagen });
  }
}
function extname(originalname: string): string {
  const lastDotIndex = originalname.lastIndexOf('.');
  return lastDotIndex >= 0 ? originalname.slice(lastDotIndex) : '';
}

