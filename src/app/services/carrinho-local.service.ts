import { Injectable, signal, computed } from '@angular/core';
import { Produto } from '../models/produto.model';

/** Um item do carrinho: o produto (formato da Fake Store API) e a quantidade escolhida. */
export interface ItemCarrinhoLocal {
  produto: Produto;
  quantidade: number;
}

/**
 * CarrinhoLocalService (segundo service do projeto)
 * Guarda o carrinho de compras, calcula quantidade e total e mantém tudo salvo
 * no localStorage. Não faz requisição nenhuma: é regra de negócio local.
 */
@Injectable({
  // Uma única instância para o app inteiro: todas as telas veem o mesmo carrinho
  providedIn: 'root',
})
export class CarrinhoLocalService {
  private readonly storageKey = 'storehub_carrinho_v1';

  // Estado reativo com Signals: quando muda, as telas que leem atualizam sozinhas
  readonly itens = signal<ItemCarrinhoLocal[]>([]);

  // Valores derivados: recalculados automaticamente sempre que "itens" muda
  readonly totalItens = computed(() =>
    this.itens().reduce((total, item) => total + item.quantidade, 0)
  );
  readonly subtotal = computed(() =>
    this.itens().reduce(
      (total, item) => total + item.produto.price * item.quantidade,
      0
    )
  );

  constructor() {
    // Ao abrir o app (ou apertar F5), recupera o carrinho salvo
    this.carregarDoLocalStorage();
  }

  /** Adiciona o produto ou, se já estiver no carrinho, soma a quantidade. */
  adicionar(produto: Produto, quantidade: number = 1): void {
    const itensAtuais = [...this.itens()];
    const indice = itensAtuais.findIndex((item) => item.produto.id === produto.id);

    if (indice >= 0) {
      itensAtuais[indice] = {
        ...itensAtuais[indice],
        quantidade: itensAtuais[indice].quantidade + quantidade,
      };
    } else {
      itensAtuais.push({ produto, quantidade: Math.max(1, quantidade) });
    }

    this.atualizarEstado(itensAtuais);
  }

  /** Diminui 1 da quantidade. Se chegar a 0, o item sai do carrinho. */
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

  /** Remove o produto inteiro, não importa a quantidade. */
  remover(produtoId: number): void {
    this.atualizarEstado(
      this.itens().filter((item) => item.produto.id !== produtoId)
    );
  }

  /** Esvazia o carrinho. */
  limpar(): void {
    this.atualizarEstado([]);
  }

  /** Único ponto que muda o estado: atualiza o signal e salva no localStorage. */
  private atualizarEstado(novosItens: ItemCarrinhoLocal[]): void {
    this.itens.set(novosItens);
    this.salvarNoLocalStorage(novosItens);
  }

  /** localStorage só guarda texto, por isso o JSON.stringify. */
  private salvarNoLocalStorage(itens: ItemCarrinhoLocal[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(itens));
    } catch (e) {
      console.error('Erro ao salvar carrinho no localStorage', e);
    }
  }

  /** Lê o texto salvo e transforma de volta em lista (JSON.parse). */
  private carregarDoLocalStorage(): void {
    try {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        const parsed: ItemCarrinhoLocal[] = JSON.parse(salvo);
        if (Array.isArray(parsed)) {
          this.itens.set(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar carrinho do localStorage', e);
    }
  }
}