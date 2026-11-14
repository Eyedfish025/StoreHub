import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  AlertController,
  ToastController,
} from '@ionic/angular/standalone';
import { CarrinhoLocalService } from '../../services/carrinho-local.service';
import { ItemCarrinho } from '../../models/produto.model';
import { ResumoTextoPipe } from '../../pipes/resumo-texto.pipe';

export interface MembroEquipe {
  nome: string;
  papel: string;
  responsabilidades: string;
  avatarIcon: string;
  githubUser?: string;
  contato?: string;
}

@Component({
  selector: 'app-carrinho-equipe',
  templateUrl: './carrinho-equipe.page.html',
  styleUrls: ['./carrinho-equipe.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    UpperCasePipe,
    ResumoTextoPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonBadge,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
  ],
})
export class CarrinhoEquipePage {
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

  // Roster da Equipe de Desenvolvimento StoreHub
  readonly equipe: MembroEquipe[] = [
    {
      nome: 'Desenvolvedor Full Stack',
      papel: 'Arquiteto de Software & Mobile Lead',
      responsabilidades:
        'Arquitetura Angular Standalone, integração FakeStoreAPI e persistência em LocalStorage.',
      avatarIcon: 'person-circle-outline',
      contato: 'equipe@storehub.dev',
    },
    {
      nome: 'Especialista em Interface Ionic',
      papel: 'UI / UX & Design System',
      responsabilidades:
        'Componentes Ionic 8, responsividade, diretivas de animação (Hover Zoom, Destaque Promoção).',
      avatarIcon: 'sparkles-outline',
      contato: 'design@storehub.dev',
    },
    {
      nome: 'Engenheiro de Qualidade & Testes',
      papel: 'QA & State Management',
      responsabilidades:
        'Fluxo reativo do carrinho de compras, Pipes standalone e validação de regras de negócio.',
      avatarIcon: 'checkmark-circle-outline',
      contato: 'qa@storehub.dev',
    },
  ];

  incrementar(item: ItemCarrinho): void {
    this.carrinhoService.adicionar(item.produto, 1);
  }

  decrementar(item: ItemCarrinho): void {
    this.carrinhoService.decrementar(item.produto.id);
  }

  remover(item: ItemCarrinho): void {
    this.carrinhoService.remover(item.produto.id);
  }

  async confirmarLimpeza(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Limpar Carrinho',
      message: 'Deseja realmente remover todos os itens do carrinho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Limpar',
          role: 'destructive',
          handler: () => {
            this.carrinhoService.limpar();
            this.exibirToast('Carrinho esvaziado com sucesso.');
          },
        },
      ],
    });
    await alert.present();
  }

  async finalizarCompra(): Promise<void> {
    const totalItens = this.carrinhoService.totalItens();
    const subtotal = this.carrinhoService.subtotal();

    const alert = await this.alertCtrl.create({
      header: '🎉 Checkout StoreHub',
      subHeader: `Total: ${subtotal.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })}`,
      message: `Você está prestes a concluir o pedido de ${totalItens} ${
        totalItens === 1 ? 'item' : 'itens'
      }. Selecione a forma de pagamento simulada:`,
      inputs: [
        {
          type: 'radio',
          label: 'Cartão de Crédito / Débito',
          value: 'cartao',
          checked: true,
        },
        {
          type: 'radio',
          label: 'PIX Instantâneo',
          value: 'pix',
        },
        {
          type: 'radio',
          label: 'Boleto Bancário',
          value: 'boleto',
        },
      ],
      buttons: [
        {
          text: 'Continuar Comprando',
          role: 'cancel',
        },
        {
          text: 'Confirmar Pedido',
          handler: () => {
            this.carrinhoService.limpar();
            this.exibirAlertaSucesso();
          },
        },
      ],
    });

    await alert.present();
  }

  private async exibirAlertaSucesso(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Compra Realizada!',
      subHeader: 'Pedido #SH-' + Math.floor(100000 + Math.random() * 900000),
      message:
        'Obrigado por comprar no StoreHub! Seu pedido foi confirmado e o carrinho foi limpo.',
      buttons: [
        {
          text: 'Voltar ao Início',
          handler: () => {
            this.router.navigate(['/home']);
          },
        },
      ],
    });
    await alert.present();
  }

  private async exibirToast(mensagem: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 1800,
      position: 'bottom',
      color: 'dark',
    });
    await toast.present();
  }
}
