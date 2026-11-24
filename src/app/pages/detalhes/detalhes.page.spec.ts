import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  ParamMap,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { DetalhesPage } from './detalhes.page';
import { ProdutosApiService } from '../../services/produtos-api.service';
import { Produto } from '../../models/produto.model';

registerLocaleData(localePt);

const PRODUTO_MOCK_1: Produto = {
  id: 1,
  title: 'Mochila StoreHub Premium',
  price: 109.95,
  category: "men's clothing",
  description: 'Mochila resistente ideal para uso diário e notebooks.',
  image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
  rating: { rate: 4.5, count: 120 },
};

const PRODUTO_MOCK_2: Produto = {
  id: 2,
  title: 'Camiseta Casual Slim',
  price: 39.9,
  category: "men's clothing",
  description: 'Camiseta confortável de algodão com corte moderno.',
  image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
  rating: { rate: 4.1, count: 85 },
};

describe('DetalhesPage', () => {
  let fixture: ComponentFixture<DetalhesPage>;
  let component: DetalhesPage;
  let paramMapSubject: BehaviorSubject<ParamMap>;
  let activatedRouteMock: {
    snapshot: { paramMap: ParamMap };
    paramMap: BehaviorSubject<ParamMap>;
  };
  let produtosApiMock: {
    getProdutoPorId: ReturnType<typeof vi.fn>;
    getProdutosPorCategoria: ReturnType<typeof vi.fn>;
  };
  let toastCtrlMock: {
    create: ReturnType<typeof vi.fn>;
  };

  async function criarComponente(idInicial: string | null): Promise<void> {
    const initialMap = convertToParamMap(idInicial !== null ? { id: idInicial } : {});
    paramMapSubject = new BehaviorSubject<ParamMap>(initialMap);
    activatedRouteMock = {
      snapshot: { paramMap: initialMap },
      paramMap: paramMapSubject,
    };

    await TestBed.configureTestingModule({
      imports: [DetalhesPage],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProdutosApiService, useValue: produtosApiMock },
        { provide: ToastController, useValue: toastCtrlMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    localStorage.clear();
    produtosApiMock = {
      getProdutoPorId: vi.fn().mockReturnValue(of(PRODUTO_MOCK_1)),
      getProdutosPorCategoria: vi
        .fn()
        .mockReturnValue(of([PRODUTO_MOCK_1, PRODUTO_MOCK_2])),
    };
    toastCtrlMock = {
      create: vi.fn().mockResolvedValue({
        present: vi.fn().mockResolvedValue(undefined),
      }),
    };
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('deve capturar o parâmetro :id via ActivatedRoute e exibir os dados do produto', async () => {
    await criarComponente('1');

    expect(produtosApiMock.getProdutoPorId).toHaveBeenCalledWith(1);
    expect(component.produto).toEqual(PRODUTO_MOCK_1);
    expect(component.carregando).toBe(false);
    expect(component.erro).toBe(false);

    const html: HTMLElement = fixture.nativeElement;
    expect(html.textContent).toContain(PRODUTO_MOCK_1.title);
    expect(html.textContent).toContain(PRODUTO_MOCK_1.description);
    expect(html.textContent).toContain(PRODUTO_MOCK_1.category.toUpperCase());
    expect(html.textContent).toContain('109,95');

    const img = html.querySelector('.image-container img') as HTMLImageElement | null;
    expect(img).not.toBeNull();
    expect(img?.getAttribute('src')).toBe(PRODUTO_MOCK_1.image);
  });

  it('deve carregar produtos relacionados da mesma categoria excluindo o produto atual', async () => {
    await criarComponente('1');

    expect(produtosApiMock.getProdutosPorCategoria).toHaveBeenCalledWith(
      PRODUTO_MOCK_1.category
    );
    expect(component.produtosRelacionados).toEqual([PRODUTO_MOCK_2]);
  });

  it('deve recarregar os detalhes e resetar a quantidade quando o parâmetro :id mudar na rota', async () => {
    await criarComponente('1');

    component.incrementarQuantidade();
    expect(component.quantidade).toBe(2);

    produtosApiMock.getProdutoPorId.mockReturnValue(of(PRODUTO_MOCK_2));
    const novoParamMap = convertToParamMap({ id: '2' });
    activatedRouteMock.snapshot.paramMap = novoParamMap;
    paramMapSubject.next(novoParamMap);
    fixture.detectChanges();

    expect(produtosApiMock.getProdutoPorId).toHaveBeenCalledWith(2);
    expect(component.produto).toEqual(PRODUTO_MOCK_2);
    expect(component.quantidade).toBe(1);
  });

  it('deve exibir estado de erro quando o parâmetro :id for inválido', async () => {
    await criarComponente('abc');

    expect(produtosApiMock.getProdutoPorId).not.toHaveBeenCalled();
    expect(component.erro).toBe(true);
    expect(component.idInvalido).toBe(true);
    expect(component.carregando).toBe(false);
  });

  it('deve tratar erro da API e permitir tentar novamente com o mesmo ID', async () => {
    produtosApiMock.getProdutoPorId.mockReturnValueOnce(
      throwError(() => new Error('Falha de rede'))
    );
    await criarComponente('1');

    expect(component.erro).toBe(true);
    expect(component.idInvalido).toBe(false);
    expect(component.produto).toBeNull();

    produtosApiMock.getProdutoPorId.mockReturnValueOnce(of(PRODUTO_MOCK_1));
    component.recarregarProduto();
    fixture.detectChanges();

    expect(produtosApiMock.getProdutoPorId).toHaveBeenCalledTimes(2);
    expect(component.erro).toBe(false);
    expect(component.produto).toEqual(PRODUTO_MOCK_1);
  });
});
