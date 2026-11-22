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
} from '@ionic/angular';
import {
  CarrinhoLocalService,
  ItemCarrinhoLocal,
} from '../../services/carrinho-local.service';
import { ResumoTextoPipe } from '../../pipes/resumo-texto.pipe';

/**
 * CarrinhoPage (rota /carrinho)
 * Mostra os itens guardados pelo CarrinhoLocalService, com quantidade (+ e -),
 * remover item, limpar tudo, total e finalização simulada.
 */
@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
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
export class CarrinhoPage {
  // O service é o mesmo de todas as telas (providedIn: 'root'), por isso o estado é compartilhado
  readonly carrinhoService = inject(CarrinhoLocalService);
  private readonly alertCtrl = inject(AlertController);
  private readonly toastCtrl = inject(ToastController);
  private readonly router = inject(Router);

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
        { text: 'Cancelar', role: 'cancel' },
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
      header: 'Checkout StoreHub',
      subHeader: `Total: ${this.formatarDolar(subtotal)}`,
      message: `Você está prestes a concluir o pedido de ${totalItens} ${
        totalItens === 1 ? 'item' : 'itens'
      }. Selecione a forma de pagamento simulada:`,
      inputs: [
        { type: 'radio', label: 'Cartão de Crédito / Débito', value: 'cartao', checked: true },
        { type: 'radio', label: 'PIX Instantâneo', value: 'pix' },
        { type: 'radio', label: 'Boleto Bancário', value: 'boleto' },
      ],
      buttons: [
        { text: 'Continuar Comprando', role: 'cancel' },
        {
          text: 'Pagar',
          // O handler recebe o valor da opção escolhida (cartao, pix ou boleto)
          handler: (metodo: string) => {
            this.pagarCom(metodo);
          },
        },
      ],
    });

    await alert.present();
  }

  /** Cada forma de pagamento tem o seu próprio passo antes de confirmar o pedido. */
  private async pagarCom(metodo: string): Promise<void> {
    const total = this.formatarDolar(this.carrinhoService.subtotal());

    if (metodo === 'pix') {
      const alert = await this.alertCtrl.create({
        header: 'Pagamento via PIX',
        subHeader: `Total: ${total}`,
        message:
          'Pague com o código PIX copia e cola (simulado): ' +
          '00020126580014BR.GOV.BCB.PIX0136storehub@pix.dev5204000053039865802BR5909STOREHUB. ' +
          'Depois de pagar, toque em "Já paguei".',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Já paguei', handler: () => this.confirmarPedido('PIX') },
        ],
      });
      await alert.present();
      return;
    }

    if (metodo === 'boleto') {
      const alert = await this.alertCtrl.create({
        header: 'Boleto Bancário',
        subHeader: `Total: ${total}`,
        message:
          'Linha digitável (simulada): 34191.79001 01043.510047 91020.150008 8 99990000012345. ' +
          'O pedido fica aguardando a compensação do boleto.',
        buttons: [
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Gerar boleto', handler: () => this.confirmarPedido('Boleto') },
        ],
      });
      await alert.present();
      return;
    }

    // Cartão: pede os dados antes de confirmar
    await this.pedirDadosCartao(total);
  }

  /**
   * Passo do cartão (simulado). Só confere o formato dos dados e não guarda nada.
   * Se algum campo estiver inválido, o handler devolve false e o alerta continua aberto.
   */
  private async pedirDadosCartao(total: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Pagamento com Cartão',
      subHeader: `Total: ${total}`,
      message: 'Simulação: use um número de teste, como 4111 1111 1111 1111.',
      inputs: [
        { name: 'nome', type: 'text', placeholder: 'Nome impresso no cartão' },
        {
          name: 'numero',
          type: 'text',
          placeholder: 'Número do cartão',
          attributes: { inputmode: 'numeric', maxlength: 23 },
        },
        {
          name: 'validade',
          type: 'text',
          placeholder: 'Validade (MM/AA)',
          attributes: { maxlength: 5 },
        },
        {
          name: 'cvv',
          type: 'text',
          placeholder: 'CVV',
          attributes: { inputmode: 'numeric', maxlength: 4 },
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Pagar',
          handler: (dados: { nome: string; numero: string; validade: string; cvv: string }) => {
            const erro = this.validarCartao(dados);
            if (erro) {
              this.exibirToast(erro);
              return false; // mantém o alerta aberto para corrigir
            }
            const final = dados.numero.replace(/\D/g, '').slice(-4);
            this.confirmarPedido(`Cartão final ${final}`);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  /** Devolve a mensagem de erro ou null se os dados estão corretos. */
  private validarCartao(d: { nome: string; numero: string; validade: string; cvv: string }): string | null {
    if (!d.nome || d.nome.trim().length < 3) {
      return 'Informe o nome impresso no cartão.';
    }

    const numero = (d.numero ?? '').replace(/\D/g, '');
    if (numero.length < 13 || numero.length > 19 || !this.passaLuhn(numero)) {
      return 'Número de cartão inválido.';
    }

    const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec((d.validade ?? '').trim());
    if (!m) {
      return 'Validade inválida. Use MM/AA.';
    }
    const hoje = new Date();
    const mes = Number(m[1]);
    const ano = 2000 + Number(m[2]);
    if (ano < hoje.getFullYear() || (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1)) {
      return 'Cartão vencido.';
    }

    if (!/^\d{3,4}$/.test((d.cvv ?? '').trim())) {
      return 'CVV inválido.';
    }
    return null;
  }

  /** Algoritmo de Luhn: confere se o número de cartão é matematicamente válido. */
  private passaLuhn(numero: string): boolean {
    let soma = 0;
    let dobrar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = Number(numero[i]);
      if (dobrar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      soma += digito;
      dobrar = !dobrar;
    }
    return soma % 10 === 0;
  }

  /** O carrinho só é limpo aqui, depois que o pagamento foi confirmado. */
  private async confirmarPedido(forma: string): Promise<void> {
    this.carrinhoService.limpar();
    await this.exibirAlertaSucesso(forma);
  }

  private async exibirAlertaSucesso(forma: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Compra Realizada!',
      subHeader: 'Pedido #SH-' + Math.floor(100000 + Math.random() * 900000),
      message: `Obrigado por comprar no StoreHub! Pagamento via ${forma} registrado e carrinho limpo.`,
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

  private formatarDolar(valor: number): string {
    return valor.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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