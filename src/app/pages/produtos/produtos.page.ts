import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonBackButton,
  IonIcon,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner,
  ToastController,
} from '@ionic/angular/standalone';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { CarrinhoLocalService } from '../../services/carrinho-local.service';
import { Produto } from '../../models/produto.model';
import { ResumoTextoPipe } from '../../pipes/resumo-texto.pipe';
import { AvaliacaoEstrelasPipe } from '../../pipes/avaliacao-estrelas.pipe';
import { DestaquePromocaoDirective } from '../../directives/destaque-promocao.directive';
import { ZoomHoverDirective } from '../../directives/zoom-hover.directive';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    UpperCasePipe,
    ResumoTextoPipe,
    AvaliacaoEstrelasPipe,
    DestaquePromocaoDirective,
    ZoomHoverDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonBackButton,
    IonIcon,
    IonBadge,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner,
  ],
})
export class ProdutosPage implements OnInit {
  private readonly produtosApi = inject(ProdutosApiService);
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly route = inject(ActivatedRoute);
  private readonly toastCtrl = inject(ToastController);
  private readonly cdr = inject(ChangeDetectorRef);

  todosProdutos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  categorias: string[] = [];

  termoBusca = '';
  categoriaSelecionada = 'todos';

  carregando = true;
  erroCarregamento = false;

  ngOnInit(): void {
    // Escutar queryParams para pré-selecionar categoria se vier da Home
    this.route.queryParams.subscribe((params) => {
      if (params['categoria']) {
        this.categoriaSelecionada = params['categoria'];
      }
      this.carregarDados();
    });
  }

  carregarDados(): void {
    this.carregando = true;
    this.erroCarregamento = false;
    this.cdr.markForCheck();

    // Carregar categorias
    this.produtosApi.getCategorias().subscribe({
      next: (cats) => {
        if (Array.isArray(cats)) {
          this.categorias = cats;
        }
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erro ao buscar categorias:', err),
    });

    // Carregar catálogo completo
    this.produtosApi
      .getTodosProdutos()
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (prods) => {
          if (Array.isArray(prods)) {
            this.todosProdutos = prods;
            this.aplicarFiltros();
          }
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao buscar produtos:', err);
          this.erroCarregamento = true;
          this.cdr.markForCheck();
        },
      });
  }

  aoDigitarBusca(event: CustomEvent): void {
    const valor = (event.detail.value || '').toLowerCase();
    this.termoBusca = valor;
    this.aplicarFiltros();
  }

  aoMudarCategoria(event: CustomEvent): void {
    this.categoriaSelecionada = event.detail.value || 'todos';
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    let lista = [...this.todosProdutos];

    // Filtro de Categoria
    if (this.categoriaSelecionada && this.categoriaSelecionada !== 'todos') {
      lista = lista.filter(
        (p) => p.category.toLowerCase() === this.categoriaSelecionada.toLowerCase()
      );
    }

    // Filtro de Busca por Título ou Descrição
    if (this.termoBusca.trim() !== '') {
      const termo = this.termoBusca.trim().toLowerCase();
      lista = lista.filter(
        (p) =>
          p.title.toLowerCase().includes(termo) ||
          p.description.toLowerCase().includes(termo)
      );
    }

    this.produtosFiltrados = lista;
  }

  limparFiltros(): void {
    this.termoBusca = '';
    this.categoriaSelecionada = 'todos';
    this.aplicarFiltros();
  }

  async adicionarAoCarrinho(produto: Produto, event: Event): Promise<void> {
    event.stopPropagation();
    this.carrinhoService.adicionar(produto, 1);

    const toast = await this.toastCtrl.create({
      message: `"${produto.title}" adicionado ao carrinho!`,
      duration: 1600,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
}
