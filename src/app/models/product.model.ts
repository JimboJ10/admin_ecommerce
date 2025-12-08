export interface Product {
  _id?: string;
  title: string;
  slug: string;
  sku: string;
  categorie: string | Categorie;
  price_soles: number;
  price_usd: number;
  portada: string;
  imagen?: string;
  galerias: Array<{
    imagen: string;
    _id: string;
  }>;
  state: number;
  stock: number;
  description: string;
  resumen: string;
  tags: string;
  type_inventario: number;
  variedades?: Variedad[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Variedad {
  _id?: string;
  product: string;
  valor: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}