export interface Producto {
  id: number;
  nombre: string;
  precioReferencia: number;
  stock: number;
  unidadMedida: string;
  categoriaId: number;
  descripcion?: string;

  // 🔥 AGREGA ESTO
  imagenUrl?: string;
  
  // JSONB dinámico
  metadata?: Record<string, any>;

  // 🔥 SOLO si el backend lo envía
  categoria?: {
    id: number;
    nombre: string;
  };
}