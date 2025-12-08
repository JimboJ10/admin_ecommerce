export interface Cupone {
  _id?: string;
  code: string;
  type_discount: number;
  discount: number;
  type_count: number;
  num_use?: number;
  type_segment: number;
  state?: number;
  products: Array<{ _id: string }>;
  categories: Array<{ _id: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}