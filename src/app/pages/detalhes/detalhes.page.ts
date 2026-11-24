import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  ChangeDetectorRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { finalize, skip } from 'rxjs/operators';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  ToastController,
} from '@ionic/angular';
import { ProdutosApiService } from '../../services/produtosapi.service';
import { CarrinhoLocalService } from '../../services/carrinholocal.service';
import { Produto } from '../../models/produto.model';
import { AvaliacaoEstrelasPipe } from '../../pipes/avaliacaoestrelas.pipe';
import { ResumoTextoPipe } from '../../pipes/resumotexto.pipe';
import { DestaquePromocaoDirective } from '../../directives/destaquepromocao.directive';
import { ZoomHoverDirective } from '../../directives/zoomhover.directive';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    UpperCasePipe,
    AvaliacaoEstrelasPipe,
    ResumoTextoPipe,
    DestaquePromocaoDirective,
    ZoomHoverDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonBadge,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
  ],
})
export class DetalhesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly produtosApi = inject(ProdutosApiService);
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly toastCtrl = inject(ToastController);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  private readonly content = viewChild(IonContent);
  private produtoSub?: Subscription;
  private relacionadosSub?: Subscription;

  produto: Produto | null = null;
  produtosRelacionados: Produto[] = [];
  produtoId: number | null = null;
  carregando = true;
  carregandoRelacionados = false;
  erro = false;
  idInvalido = false;
  mensagemErro = '';
  quantidade = 1;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.produtoSub?.unsubscribe();
      this.relacionadosSub?.unsubscribe();
    });
  }

  ngOnInit(): void {
    const idInicial = this.route.snapshot.paramMap.get('id');
    this.processarParametroId(idInicial);

    this.route.paramMap
      .pipe(skip(1), takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.processarParametroId(params.get('id'));
      });
  }

  private processarParametroId(idParam: string | null): void {
    const id = Number(idParam);

    if (!idParam || !Number.isInteger(id) || id <= 0) {
      this.produtoSub?.unsubscribe();
      this.relacionadosSub?.unsubscribe();
      this.produtoId = null;
      this.produto = null;
      this.produtosRelacionados = [];
      this.idInvalido = true;
      this.erro = true;
      this.mensagemErro = 'O identificador do produto informado na rota é inválido.';
      this.carregando = false;
      this.carregandoRelacionados = false;
      this.cdr.markForCheck();
      return;
    }

    this.carregarProduto(id);
  }

  carregarProduto(id: number): void {
    this.produtoSub?.unsubscribe();
    this.relacionadosSub?.unsubscribe();

    this.produtoId = id;
    this.produto = null;
    this.produtosRelacionados = [];
    this.quantidade = 1;
    this.carregando = true;
    this.carregandoRelacionados = false;
    this.erro = false;
    this.idInvalido = false;
    this.mensagemErro = '';
    this.cdr.markForCheck();

    this.produtoSub = this.produtosApi
      .getProdutoPorId(id)
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (prod) => {
          if (!prod || !prod.id) {
            this.produto = null;
            this.erro = true;
            this.mensagemErro =
              'Nenhum produto foi encontrado para o identificador informado.';
            this.cdr.markForCheck();
            return;
          }

          this.produto = prod;
          this.cdr.markForCheck();
          this.rolarParaOTopo();
          this.carregarRelacionados(prod);
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do produto:', err);
          this.produto = null;
          this.erro = true;
          this.mensagemErro =
            'Não foi possível obter as informações deste item. Verifique sua conexão e tente novamente.';
          this.cdr.markForCheck();
        },
      });
  }

  recarregarProduto(): void {
    if (this.produtoId !== null) {
      this.carregarProduto(this.produtoId);
    }
  }

  private rolarParaOTopo(): void {
    const ionContent = this.content();
    if (ionContent && typeof ionContent.scrollToTop === 'function') {
      Promise.resolve()
        .then(() => ionContent.scrollToTop(300))
        .catch(() => undefined);
    }
  }

  private carregarRelacionados(produtoAtual: Produto): void {
    this.relacionadosSub?.unsubscribe();
    this.carregandoRelacionados = true;
    this.cdr.markForCheck();

    this.relacionadosSub = this.produtosApi
      .getProdutosPorCategoria(produtoAtual.category)
      .pipe(
        finalize(() => {
          this.carregandoRelacionados = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (lista) => {
          this.produtosRelacionados = Array.isArray(lista)
            ? lista.filter((item) => item.id !== produtoAtual.id).slice(0, 4)
            : [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao carregar produtos relacionados:', err);
          this.produtosRelacionados = [];
          this.cdr.markForCheck();
        },
      });
  }

  incrementarQuantidade(): void {
    this.quantidade++;
  }

  decrementarQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  async adicionarAoCarrinho(): Promise<void> {
    if (!this.produto) return;

    this.carrinhoService.adicionar(this.produto, this.quantidade);

    const toast = await this.toastCtrl.create({
      message: `${this.quantidade}x "${this.produto.title}" adicionado(s) ao carrinho!`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          text: 'Ver Carrinho',
          role: 'info',
          handler: () => {
            this.router.navigate(['/carrinho']);
          },
        },
      ],
    });
    await toast.present();
  }
}
