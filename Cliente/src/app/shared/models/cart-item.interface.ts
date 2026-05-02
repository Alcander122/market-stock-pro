export interface CartItem {
    id: number;
    nombre: string;
    precio: number;
    imagenUrl?: string;
    cantidad: number;
    metadata?: any;
}