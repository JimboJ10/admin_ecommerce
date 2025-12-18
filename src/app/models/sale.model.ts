export interface Sale {
  _id: string;
  user: {
    _id: string;
    name: string;
    surname: string;
    email: string;
  };
  currency_payment: string;
  method_payment: string;
  n_transacccion: string;
  total: number;
  currency_total: string;
  price_dolar: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleDetail {
  _id: string;
  sale: string;
  product: {
    _id: string;
    title: string;
    sku: string;
    slug: string;
    imagen: string;
    categorie: any;
    price_usd: number;
    type_inventario: number;
  };
  type_discount: number;
  discount: number;
  cantidad: number;
  variedad?: {
    _id: string;
    valor: string;
  };
  code_cupon?: string;
  code_discount?: string;
  price_unitario: number;
  subtotal: number;
  total: number;
}

export interface SaleAddress {
  _id: string;
  sale: string;
  name: string;
  surname: string;
  pais: string;
  address: string;
  referencia?: string;
  ciudad: string;
  region: string;
  telefono: string;
  email: string;
  nota?: string;
}

export interface SaleDetailResponse {
  sale: Sale;
  sale_details: SaleDetail[];
  sale_address: SaleAddress;
}