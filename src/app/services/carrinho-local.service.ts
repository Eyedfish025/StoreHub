import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produto } from '../models/produto.model';

export interface ItemCarrinhoLocal {
  produto: Produto;
  quantidade: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoLocalService {
  private readonly storageKey = 'storehub_carrinho_v1';

  // State via Angular Signals
  readonly itens = signal<ItemCarrinhoLocal[]>([]);
  readonly totalItens = computed(() =>
    this.itens().reduce((total, item) => total + item.quantidade, 0)
  );
  readonly subtotal = computed(() =>
    this.itens().reduce(
      (total, item) => total + item.produto.price * item.quantidade,
      0
    )
  );

  // Reactive State via RxJS BehaviorSubject for template async binding
  private readonly itensSubject = new BehaviorSubject<ItemCarrinhoLocal[]>([]);
  readonly itens$: Observable<ItemCarrinhoLocal[]> = this.itensSubject.asObservable();

  private readonly totalItensSubject = new BehaviorSubject<number>(0);
  readonly totalItens$: Observable<number> = this.totalItensSubject.asObservable();

  private readonly subtotalSubject = new BehaviorSubject<number>(0);
  readonly subtotal$: Observable<number> = this.subtotalSubject.asObservable();

  constructor() {
    this.carregarDoLocalStorage();
  }

  /**
   * Adiciona um produto ao carrinho ou incrementa sua quantidade
   */
  adicionar(produto: Produto, quantidade: number = 1): void {
    const itensAtuais = [...this.itens()];
    const indice = itensAtuais.findIndex((item) => item.produto.id === produto.id);

    if (indice >= 0) {
      itensAtuais[indice] = {
        ...itensAtuais[indice],
        quantidade: itensAtuais[indice].quantidade + quantidade,
      };
    } else {
      itensAtuais.push({
        produto,
        quantidade: Math.max(1, quantidade),
      });
    }

    this.atualizarEstado(itensAtuais);
  }

  // Alias para atender aos nomes em inglês ou português
  add(produto: Produto, quantidade: number = 1): void {
    this.adicionar(produto, quantidade);
  }

  /**
   * Decrementa a quantidade de um item. Se chegar a 0, remove o item.
   */
  decrementar(produtoId: number): void {
    const itensAtuais = [...this.itens()];
    const indice = itensAtuais.findIndex((item) => item.produto.id === produtoId);

    if (indice >= 0) {
      if (itensAtuais[indice].quantidade > 1) {
        itensAtuais[indice] = {
          ...itensAtuais[indice],
          quantidade: itensAtuais[indice].quantidade - 1,
        };
      } else {
        itensAtuais.splice(indice, 1);
      }
      this.atualizarEstado(itensAtuais);
    }
  }

  decrement(produtoId: number): void {
    this.decrementar(produtoId);
  }

  /**
   * Remove completamente o produto do carrinho
   */
  remover(produtoId: number): void {
    const itensFiltrados = this.itens().filter(
      (item) => item.produto.id !== produtoId
    );
    this.atualizarEstado(itensFiltrados);
  }

  remove(produtoId: number): void {
    this.remover(produtoId);
  }

  /**
   * Limpa todos os itens do carrinho
   */
  limpar(): void {
    this.atualizarEstado([]);
  }

  clear(): void {
    this.limpar();
  }

  /**
   * Retorna os itens atuais do carrinho
   */
  obterItens(): ItemCarrinhoLocal[] {
    return this.itens();
  }

  /**
   * Atualiza os signals, subjects e sincroniza no localStorage
   */
  private atualizarEstado(novosItens: ItemCarrinhoLocal[]): void {
    this.itens.set(novosItens);
    this.itensSubject.next(novosItens);

    const total = novosItens.reduce((sum, item) => sum + item.quantidade, 0);
    this.totalItensSubject.next(total);

    const sub = novosItens.reduce(
      (sum, item) => sum + item.produto.price * item.quantidade,
      0
    );
    this.subtotalSubject.next(sub);

    this.salvarNoLocalStorage(novosItens);
  }

  /**
   * Salva o estado atual no localStorage sob a chave 'storehub_carrinho_v1'
   */
  private salvarNoLocalStorage(itens: ItemCarrinhoLocal[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(itens));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage', e);
    }
  }

  /**
   * Carrega os itens salvos do localStorage
   */
  private carregarDoLocalStorage(): void {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        const parsed: ItemCarrinhoLocal[] = JSON.parse(salvo);
        if (Array.isArray(parsed)) {
          this.atualizarEstado(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar carrinho do localStorage', e);
    }
    this.atualizarEstado([]);
  }
}
