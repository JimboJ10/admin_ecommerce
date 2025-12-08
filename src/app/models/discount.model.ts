export interface Discount {
  _id?: string;
  type_campaign: number;
  type_discount: number;
  discount: number;
  start_date: Date;
  end_date: Date;
  start_date_num: number;
  end_date_num: number;
  state?: number;
  type_segment: number;
  products: Array<{ _id: string }>;
  categories: Array<{ _id: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}