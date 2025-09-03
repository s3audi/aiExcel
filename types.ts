export type TableRow = Record<string, string | number>;

export interface Link {
  name: string;
  url: string;
}

export interface Product {
  barcode: string;
  description: string;
  price: number;
  commission: number;
  productUrl: string | null;
  photo1: string | null;
  photo2: string | null;
  photo3: string | null;
  cost: number;
  isFavorite: boolean;
  data1: string | null;
  data2: string | null;
  data3: string | null;
}

export type ColumnMapping = Record<keyof Omit<Product, 'cost' | 'isFavorite'>, string | null>;