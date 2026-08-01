export type Category = 'jewelry' | 'bags' | 'watches' | 'other';

export const CATEGORIES: readonly Category[] = [
  'jewelry',
  'bags',
  'watches',
  'other',
] as const;

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  description: string | null;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
}

// All editable fields on a product, used for inserts and updates. `id` and
// `created_at` are server-managed.
export type ProductInput = {
  name: string;
  price: number;
  category: Category;
  description: string | null;
  image_url: string | null;
  in_stock: boolean;
};

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  qty: number;
}

export type CheckoutMethod = 'whatsapp' | 'bank' | 'opay';

// Manually authored Database types are tricky to align with Supabase's
// GenericSchema (which expects exact Relationships shapes). For a small app,
// we get better ergonomics by typing the row shape and letting Supabase
// infer the rest. When the schema grows, swap this for a generated
// `supabase gen types typescript` output.
export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: ProductInput;
        Update: Partial<ProductInput>;
      };
    };
  };
};