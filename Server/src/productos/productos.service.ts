import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productosRepository: Repository<Producto>,
  ) { }

  // Crear un producto nuevo (para el panel de Admin)
  async create(createProductoDto: CreateProductoDto) {
    try {
      const { categoriaId, ...datosProducto } = createProductoDto;

      const nuevoProducto = this.productosRepository.create({
        ...datosProducto,
        // IMPORTANTE: Mapeamos el ID a la entidad Relacional
        categoria: { id: categoriaId }
      });

      return await this.productosRepository.save(nuevoProducto);
    } catch (error) {
      // Esto te dirá en la terminal de NestJS exactamente qué falló
      console.error('Error en base de datos:', error);
      throw new InternalServerErrorException('Error al guardar en DB');
    }
  }

  // MODIFICA ESTE MÉTODO
  async findAll() {
    // Agregamos 'categoria' para que traiga el objeto con su ID y Nombre
    return await this.productosRepository.find({
      relations: ['categoria']
    });
  }

  // TAMBIÉN MODIFICA ESTE PARA QUE AL EDITAR NO SE PIERDA LA INFO
  async findOne(id: number) {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria']
    });

    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe`);
    }
    return producto;
  }

  // Actualizar stock o precio
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const { categoriaId, ...rest } = updateProductoDto;

    const producto = await this.productosRepository.preload({
      id: id,
      ...rest,
      // Si viene categoriaId, actualizamos la relación, si no, lo dejamos igual
      ...(categoriaId && { categoria: { id: categoriaId } })
    });

    if (!producto) throw new NotFoundException(`No se pudo actualizar: ID ${id} no existe`);

    return await this.productosRepository.save(producto);
  }

  // Eliminar producto
  async remove(id: number) {
    const producto = await this.findOne(id);
    return await this.productosRepository.remove(producto);
  }
}