export interface Producto {
  id: number;
  nombre: string;
  precioReferencia: number;
  stock: number;
  unidadMedida: string;
  categoriaId: number; // Esto es la clave para separar Leche de Tomate
  descripcion?: string;
}