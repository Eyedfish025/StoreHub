import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
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
  ToastController,
} from '@ionic/angular';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { CarrinhoLocalService } from '../../services/carrinho-local.service';
import { Produto } from '../../models/produto.model';
import { AvaliacaoEstrelasPipe } from '../../pipes/avaliacao-estrelas.pipe';
import { DestaquePromocaoDirective } from '../../directives/destaque-promocao.directive';
import { ZoomHoverDirective } from '../../directives/zoom-hover.directive';

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
  ],
})
export class DetalhesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly produtosApi = inject(ProdutosApiService);
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly toastCtrl = inject(ToastController);
  private readonly cdr = inject(ChangeDetectorRef);

  produto: Produto | null = null;
  carregando = true;
  erro = false;
  quantidade = 1;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (isNaN(id) || id <= 0) {
      this.erro = true;
      this.carregando = false;
      this.cdr.markForCheck();
      return;
    }

    this.carregarProduto(id);
  }

  carregarProduto(id: number): void {
    this.carregando = true;
    this.erro = false;
    this.cdr.markForCheck();

    this.produtosApi
      .getProdutoPorId(id)
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (prod) => {
          this.produto = prod;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do produto:', err);
          this.erro = true;
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
