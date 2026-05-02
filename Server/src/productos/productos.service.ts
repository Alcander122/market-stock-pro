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

  async create(createProductoDto: CreateProductoDto) {
    try {
      const { categoriaId, ...datosProducto } = createProductoDto;
      const nuevoProducto = this.productosRepository.create({
        ...datosProducto,
        categoria: { id: categoriaId }
      });
      return await this.productosRepository.save(nuevoProducto);
    } catch (error) {
      console.error('Error en DB:', error);
      throw new InternalServerErrorException('Error al guardar el producto');
    }
  }

  async findAll() {
    return await this.productosRepository.find({ relations: ['categoria'] });
  }

  async findOne(id: number) {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria']
    });
    if (!producto) throw new NotFoundException(`ID ${id} no existe`);
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const { categoriaId, ...rest } = updateProductoDto;
    const producto = await this.productosRepository.preload({
      id: id,
      ...rest,
      ...(categoriaId && { categoria: { id: categoriaId } })
    });
    if (!producto) throw new NotFoundException(`ID ${id} no existe`);
    return await this.productosRepository.save(producto);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return await this.productosRepository.remove(producto);
  }
}