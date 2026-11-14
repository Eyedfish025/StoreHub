import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
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
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    IonIcon,
    IonBadge,
    IonChip,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
    IonSpinner,
  ],
})
export class HomePage implements OnInit {
  private readonly produtosApi = inject(ProdutosApiService);
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

  categorias: string[] = [];
  produtosPromocionais: Produto[] = [];
  carregando = true;
  erroCarregamento = false;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando = true;
    this.erroCarregamento = false;

    // Carregar categorias
    this.produtosApi.getCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });

    // Carregar todos os produtos e filtrar ofertas promocionais (< $50)
    this.produtosApi.getTodosProdutos().subscribe({
      next: (prods) => {
        // Ofertas promocionais: produtos com preço menor que $50
        this.produtosPromocionais = prods.filter((p) => p.price < 50);
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err),
        this.erroCarregamento = true;
        this.carregando = false;
      },
    });
  }

  navegarParaCategoria(categoria: string): void {
    this.router.navigate(['/produtos'], {
      queryParams: { categoria },
    });
  }

  async adicionarAoCarrinho(produto: Produto, event: Event): Promise<void> {
    event.stopPropagation();
    this.carrinhoService.adicionar(produto, 1);

    const toast = await this.toastCtrl.create({
      message: `"${produto.title}" adicionado ao carrinho!`,
      duration: 1800,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline',
    });
    await toast.present();
  }
}
