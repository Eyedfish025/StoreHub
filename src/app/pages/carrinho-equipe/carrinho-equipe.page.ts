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
import {
  CarrinhoLocalService,
  ItemCarrinhoLocal,
} from '../../services/carrinho-local.service';
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

  readonly equipe = [
    {
      id: 1,
      nome: 'Sérgio Guilherme F. de Lima',
      matricula: '01796267',
      papel: 'Páginas e Roteamento (1,0 pt)',
      responsabilidades:
        'Organização da arquitetura Standalone, abas (ion-tabs) e componentes visuais nativos do Ionic.',
      avatarIcon: 'navigate-circle-outline',
      contato: 'sergio.lima@storehub.dev',
    },
    {
      id: 2,
      nome: 'Jonathan Gustavo Gomes dos Santos (Jônatas)',
      matricula: '01821597',
      papel: 'Consumo de API (1,5 pt)',
      responsabilidades:
        'Integração com a FakeStoreAPI (3 métodos GET: produtos, categorias e detalhes) via HttpClient.',
      avatarIcon: 'cloud-download-outline',
      contato: 'jonathan.santos@storehub.dev',
    },
    {
      id: 3,
      nome: 'Emilly Marrocos Mendonça Ciriaco',
      matricula: '01842163',
      papel: 'Segundo Service e Página do Carrinho (1,0 pt)',
      responsabilidades:
        'Gerenciamento do estado do carrinho, cálculo de totais, persistência no localStorage e página dedicada /carrinho.',
      avatarIcon: 'cart-outline',
      contato: 'emilly.ciriaco@storehub.dev',
    },
    {
      id: 4,
      nome: 'Mylena Monteiro Alves',
      matricula: '01855595',
      papel: 'Pipes (1,0 pt, 0,25 cada)',
      responsabilidades:
        'Pipes de formatação (CurrencyPipe, UpperCasePipe, ResumoTextoPipe, AvaliacaoEstrelasPipe) nos templates HTML.',
      avatarIcon: 'color-wand-outline',
      contato: 'mylena.alves@storehub.dev',
    },
    {
      id: 5,
      nome: 'Felix Luiz Cavalcanti Bomfim Neto',
      matricula: '01810567',
      papel: 'Diretivas e Fluxo (1,5 pt)',
      responsabilidades:
        'Diretivas personalizadas (DestaquePromocaoDirective, ZoomHoverDirective) e controle de fluxo (@if e @for).',
      avatarIcon: 'flash-outline',
      contato: 'felix.neto@storehub.dev',
    },
    {
      id: 6,
      nome: 'José Rhawan Michel dos Santos',
      matricula: '01864924',
      papel: 'Parâmetro por Rota (1,0 pt extra)',
      responsabilidades:
        'Transmissão de ID nos cards e captura dinâmica na rota /detalhes/:id via ActivatedRoute.',
      avatarIcon: 'git-network-outline',
      contato: 'jose.santos@storehub.dev',
    },
  ];

  incrementar(item: ItemCarrinhoLocal): void {
    this.carrinhoService.adicionar(item.produto, 1);
  }

  decrementar(item: ItemCarrinhoLocal): void {
    this.carrinhoService.decrementar(item.produto.id);
  }

  remover(item: ItemCarrinhoLocal): void {
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
      subHeader: `Total: ${subtotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}`,
      message: `Você está prestes a concluir o pedido de ${totalItens} ${totalItens === 1 ? 'item' : 'itens'
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
        'Obrigado por comprar no StoreHub! Seu pedido foi confirmado com sucesso.',
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
