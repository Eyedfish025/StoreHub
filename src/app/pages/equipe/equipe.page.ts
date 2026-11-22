import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
} from '@ionic/angular';

export interface MembroEquipe {
  nome: string;
  matricula: string;
  papel: string;
  responsabilidades: string;
  avatarIcon: string;
  contato?: string;
}

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.page.html',
  styleUrls: ['./equipe.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonLabel,
  ],
})
export class EquipePage {
  readonly integrantes: MembroEquipe[] = [
    {
      nome: 'Sérgio Guilherme F. de Lima',
      matricula: '01796267',
      papel: 'Desenvolvedor Front-end & Arquitetura',
      responsabilidades:
        'Responsável pela arquitetura de páginas, estruturação de rotas standalone e desenvolvimento do sistema de navegação por abas com componentes nativos do Ionic.',
      avatarIcon: 'navigate-circle-outline',

    },
    {
      nome: 'Jonathan Gustavo Gomes dos Santos',
      matricula: '01821597',
      papel: 'Desenvolvedor de Integração & Serviços Web',
      responsabilidades:
        'Responsável pelo desenvolvimento da camada de serviços HTTP, integração e consumo assíncrono dos endpoints de produtos, categorias e detalhes.',
      avatarIcon: 'cloud-download-outline',

    },
    {
      nome: 'Emilly Marrocos Mendonça Ciriaco',
      matricula: '01842163',
      papel: 'Desenvolvedora Front-end & Gestão de Estado',
      responsabilidades:
        'Responsável pela lógica de gerenciamento de estado do carrinho de compras, cálculo de valores e quantidades, persistência em localStorage e tela dedicada do carrinho.',
      avatarIcon: 'cart-outline',

    },
    {
      nome: 'Mylena Monteiro Alves',
      matricula: '01855595',
      papel: 'Desenvolvedora Front-end & Formatação de Dados',
      responsabilidades:
        'Responsável pela implementação e integração dos pipes de transformação de dados para formatação monetária, padronização de categorias, resumos de texto e avaliações em estrelas.',
      avatarIcon: 'color-wand-outline',

    },
    {
      nome: 'Felix Luiz Cavalcanti Bomfim Neto',
      matricula: '01810567',
      papel: 'Desenvolvedor de Interface & Interatividade',
      responsabilidades:
        'Responsável pelo fluxo reativo da interface e criação das diretivas customizadas para destaque visual de ofertas promocionais e efeitos interativos de escala e elevação.',
      avatarIcon: 'flash-outline',

    },
    {
      nome: 'José Rhawan Michel dos Santos',
      matricula: '01864924',
      papel: 'Desenvolvedor Front-end & Roteamento Dinâmico',
      responsabilidades:
        'Responsável pela navegação parametrizada, transmissão de identificadores entre catálogo e carrinho e renderização da página de detalhes individuais de produtos.',
      avatarIcon: 'git-network-outline',

    },
  ];
}
