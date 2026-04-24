export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Artisan {
  name: string;
  region: string;
  experience: string;
  creationTime: string;
  certificationId: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  stock: number;
  isBestSeller?: boolean;
  description: string;
  image: string;
  category: string;
  province?: string;
  location?: string;
  originStory?: string;
  details?: string[];
  material?: string;
  dimensions?: string;
  weight?: string;
  shippingInfo?: string;
  isFeatured?: boolean;
  rating?: number;
  gallery?: string[];
  reviews?: Review[];
  artisan?: Artisan;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}
