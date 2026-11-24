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
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pelas Páginas e Roteamento',
      avatarIcon: 'navigate-circle-outline',

    },
    {
      nome: 'Jonathan Gustavo Gomes dos Santos',
      matricula: '01821597',
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pelo Consumo de API ',
      avatarIcon: 'cloud-download-outline',

    },
    {
      nome: 'Emilly Marrocos Mendonça Ciriaco',
      matricula: '01842163',
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pela Segundo Service e página do carrinho. ',
      avatarIcon: 'cart-outline',

    },
    {
      nome: 'Mylena Monteiro Alves',
      matricula: '01855595',
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pelas Pipes. ',
      avatarIcon: 'color-wand-outline',

    },
    {
      nome: 'Felix Luiz Cavalcanti Bomfim Neto',
      matricula: '01810567',
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pelas Diretivas e Fluxo.',
      avatarIcon: 'flash-outline',

    },
    {
      nome: 'José Rhawan Michel dos Santos',
      matricula: '01864924',
      papel: 'ALUNO DE CODIGO DE ALTA PEFORMANCE MOBILE',
      responsabilidades:
        'Responsável pelo Parâmetro por Rota.',
      avatarIcon: 'git-network-outline',

    },
  ];
}
