export interface ProdutoRating {
  rate: number;
  count: number;
}

export interface Produto {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProdutoRating;
}

export interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}
