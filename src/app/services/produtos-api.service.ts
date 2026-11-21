import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutosApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://fakestoreapi.com';

  /**
   * Retorna todos os produtos do catálogo
   */
  getTodosProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/products`);
  }

  /**
   * Retorna a lista de categorias disponíveis
   */
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/categories`);
  }

  /**
   * Retorna os detalhes de um produto específico por ID
   */
  getProdutoPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/products/${id}`);
  }

  /**
   * Retorna produtos filtrados por categoria
   */
  getProdutosPorCategoria(categoria: string): Observable<Produto[]> {
    return this.http.get<Produto[]>(
      `${this.baseUrl}/products/category/${encodeURIComponent(categoria)}`
    );
  }
}
