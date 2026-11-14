# StoreHub — Aplicativo de E-Commerce (Ionic 8 + Angular Standalone)

O **StoreHub** é uma aplicação completa e moderna de comércio eletrônico desenvolvida para atender aos critérios avaliativos da disciplina de Desenvolvimento Mobile. A aplicação foi construída com **Ionic 8** e **Angular 100% Standalone**, consumindo a API pública [FakeStoreAPI](https://fakestoreapi.com) para exibição de catálogo de produtos, categorias, detalhes individuais e gerenciamento de carrinho com persistência em `localStorage`.

---

## 🚀 Destaques da Arquitetura

* **100% Standalone Components:** Zero `NgModules`. Todas as páginas, diretivas e pipes utilizam `standalone: true`.
* **Controle de Fluxo Moderno do Angular:** Uso exclusivo dos blocos nativos `@if` e `@for` (zero ocorrências de `*ngIf` ou `*ngFor`).
* **Design Responsivo com Ionic 8:** Interface rica com `IonHeader`, `IonToolbar`, `IonCard`, `IonGrid`, `IonSegment`, `IonSearchbar`, `IonBadge`, `IonChip`, `IonThumbnail` e `IonList`.
* **Serviços Reativos e Tipados:** Interfaces TypeScript estritas (`Produto`, `ItemCarrinho`) com injeção de dependência via `inject()` e `HttpClient`.
* **Persistência de Estado Local:** Carrinho salvo automaticamente no navegador sob a chave `storehub_carrinho_v1`.

---

## 📂 Estrutura do Projeto

```text
src/
├── main.ts                                         # Bootstrap standalone com provideHttpClient() e provideIonicAngular()
└── app/
    ├── app.component.ts                            # Root IonApp + IonRouterOutlet + registro completo de Ionicons (addIcons)
    ├── app.routes.ts                               # Rotas com lazy loading via loadComponent
    ├── models/
    │   └── produto.model.ts                        # Interfaces Produto, ProdutoRating e ItemCarrinho
    ├── services/
    │   ├── produtos-api.service.ts                 # Consumo da FakeStoreAPI via HttpClient
    │   └── carrinho-local.service.ts               # Gerenciamento reativo e persistência no localStorage
    ├── pipes/
    │   ├── resumo-texto.pipe.ts                    # Pipe standalone resumoTexto (trunca textos longos)
    │   └── avaliacao-estrelas.pipe.ts              # Pipe standalone avaliacaoEstrelas (estrelas visuais ★★★★☆)
    ├── directives/
    │   ├── destaque-promocao.directive.ts          # Diretiva [appDestaquePromocao] (@HostBinding para itens < $50)
    │   └── zoom-hover.directive.ts                 # Diretiva [appZoomHover] (@HostListener mouseenter/mouseleave)
    └── pages/
        ├── home/home.page.ts                       # Banner de boas-vindas, chips de categorias e ofertas em destaque
        ├── produtos/produtos.page.ts               # Catálogo completo, busca em tempo real e filtro por segmento
        ├── detalhes/detalhes.page.ts               # Detalhes do item por :id, seletor de quantidade e adição ao carrinho
        └── carrinho-equipe/carrinho-equipe.page.ts # Gerenciamento do carrinho (+, -, remover, checkout) e roster da equipe
```

---

## 🛠️ Tecnologias e Recursos Implementados

### 1. Integração com FakeStoreAPI (`ProdutosApiService`)
- `getTodosProdutos(): Observable<Produto[]>`: Obtém a listagem completa de produtos.
- `getCategorias(): Observable<string[]>`: Lista as categorias existentes.
- `getProdutoPorId(id: number): Observable<Produto>`: Detalha o produto selecionado via rota dinâmica `:id`.

### 2. Carrinho Reativo & Persistente (`CarrinhoLocalService`)
- Adição de novos produtos ou incremento de quantidade.
- Decremento com remoção automática ao atingir 0.
- Exclusão individual e limpeza completa do carrinho.
- Cálculo reativo do total de itens (`totalItens`) e subtotal financeiro (`subtotal`).
- Sincronização automática com `localStorage` sob a chave `storehub_carrinho_v1` resistente a recarregamentos (`F5`).

### 3. Rotas & Navegação (Lazy Loading)
- `/home` (`HomePage`): Hero banner interativo, chips de categorias para navegação rápida e ofertas promocionais.
- `/produtos` (`ProdutosPage`): Catálogo com barra de busca em tempo real (`IonSearchbar`) e segmentação (`IonSegment`).
- `/detalhes/:id` (`DetalhesPage`): Leitura do parâmetro de rota dinâmica, apresentação visual do produto e seleção de quantidade.
- `/carrinho-equipe` (`CarrinhoEquipePage`): Checkout interativo com alerta simulado de pagamento e roster de apresentação da equipe de desenvolvimento.

### 4. Pipes Customizados & Nativos
- `resumoTexto` (`ResumoTextoPipe`): Trunca textos de títulos e descrições com controle de caracteres e sufixo.
- `avaliacaoEstrelas` (`AvaliacaoEstrelasPipe`): Converte valores numéricos em estrelas visuais, ex: `★★★★☆ (4.2)`.
- `CurrencyPipe` nativo do Angular para formatação de moeda em dólares (`USD`).
- `UpperCasePipe` nativo para padronização de categorias.

### 5. Diretivas Customizadas
- `[appDestaquePromocao]` (`DestaquePromocaoDirective`): Aplica automaticamente borda verde (`#2dd36f`), sombra glow e sutil fundo colorido a produtos com valor inferior a $50.00 usando `@HostBinding`.
- `[appZoomHover]` (`ZoomHoverDirective`): Efeito suave de escala e elevação com transições CSS via `@HostListener` (`mouseenter` / `mouseleave`).

---

## 📋 Checklist de Validação

- [x] `provideHttpClient()` registrado no `src/main.ts`.
- [x] Todos os Ionicons registrados via `addIcons()` no `app.component.ts`.
- [x] Zero ocorrências de `*ngIf` ou `*ngFor` em todos os templates (100% `@if` e `@for`).
- [x] Produtos com preço inferior a `$50.00` recebem destaque visual via `[appDestaquePromocao]`.
- [x] Persistência do carrinho no `localStorage` sob a chave `storehub_carrinho_v1`.
- [x] Compilação de produção executada com sucesso (`npm run build`).

---

## 💻 Como Executar

### Pré-requisitos
* Node.js (v18+)
* NPM ou Yarn

### Passo a Passo

1. **Instalar dependências (caso necessário):**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   # ou
   npx ionic serve
   ```

3. **Gerar build de produção:**
   ```bash
   npm run build
   ```
