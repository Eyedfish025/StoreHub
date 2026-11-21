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
    path: 'carrinho-equipe',
    loadComponent: () =>
      import('./pages/carrinho-equipe/carrinho-equipe.page').then(
        (m) => m.CarrinhoEquipePage
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
