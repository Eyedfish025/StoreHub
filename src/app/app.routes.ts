import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'produtos',
    loadComponent: () =>
      import('./pages/produtos/produtos.page').then((m) => m.ProdutosPage),
  },
  {
    path: 'detalhes/:id',
    loadComponent: () =>
      import('./pages/detalhes/detalhes.page').then((m) => m.DetalhesPage),
  },
  {
    path: 'carrinho',
    loadComponent: () =>
      import('./pages/carrinho/carrinho.page').then((m) => m.CarrinhoPage),
  },
  {
    // Página da equipe (a do Guilherme). O caminho antigo continua para não quebrar nada.
    path: 'carrinho-equipe',
    loadComponent: () =>
      import('./pages/carrinho-equipe/carrinho-equipe.page').then(
        (m) => m.CarrinhoEquipePage
      ),
  },
  {
    path: 'equipe',
    loadComponent: () =>
      import('./pages/equipe/equipe.page').then((m) => m.EquipePage),
  },
  {
    // O curinga sempre por último
    path: '**',
    redirectTo: 'home',
  },
];
