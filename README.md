# StoreHub — Aplicativo de E-Commerce (Ionic 8 + Angular Standalone)

O **StoreHub** é uma aplicação completa e moderna de comércio eletrônico desenvolvida para atender aos critérios avaliativos da disciplina de Desenvolvimento Mobile. A aplicação foi construída com **Ionic Framework** e **Angular 100% Standalone**, consumindo a API pública [FakeStoreAPI](https://fakestoreapi.com) para exibição de catálogo de produtos, categorias dinâmicas, detalhes individuais, sistema de navegação por abas (`ion-tabs`) e gerenciamento de carrinho com persistência em `localStorage`.

---

## 🚀 Destaques da Arquitetura

* **100% Standalone Components:** Zero `NgModules`. Todas as páginas, diretivas e pipes utilizam `standalone: true`.
* **Controle de Fluxo Moderno do Angular:** Uso exclusivo dos blocos nativos `@if` e `@for` (zero ocorrências de `*ngIf` ou `*ngFor`).
* **Navegação por Abas (`ion-tabs`):** Barra inferior de abas no layout raiz para alternância instantânea entre Início, Produtos, Carrinho e Equipe.
* **Componentes Nativos do Ionic:** `ion-header`, `ion-toolbar`, `ion-content`, `ion-card`, `ion-list`, `ion-badge`, `ion-button` e `ion-tabs`.
* **Serviços Reativos e Tipados:** Injeção de dependência via `inject()` e `HttpClient` configurado via `provideHttpClient()`.
* **Persistência de Estado Local:** Carrinho sincronizado no navegador sob a chave `storehub_carrinho_v1`.

---

## 📂 Estrutura de Páginas e Rotas

```text
src/
├── main.ts                                         # Bootstrap standalone com provideHttpClient() e provideIonicAngular()
└── app/
    ├── app.component.html                          # ion-tabs + ion-tab-bar (Início, Produtos, Carrinho com badge, Equipe)
    ├── app.component.ts                            # Root component + registro completo de Ionicons (addIcons)
    ├── app.routes.ts                               # Rotas standalone com lazy loading via loadComponent
    ├── models/
    │   └── produto.model.ts                        # Interfaces Produto, ProdutoRating e ItemCarrinho
    ├── services/
    │   ├── produtos-api.service.ts                 # Consumo da FakeStoreAPI via HttpClient (3 métodos GET)
    │   └── carrinho-local.service.ts               # Gerenciamento reativo do carrinho e persistência no localStorage
    ├── pipes/
    │   ├── resumo-texto.pipe.ts                    # Pipe standalone resumoTexto (trunca descrições)
    │   └── avaliacao-estrelas.pipe.ts              # Pipe standalone avaliacaoEstrelas (estrelas visuais ★★★★★)
    ├── directives/
    │   ├── destaque-promocao.directive.ts          # Diretiva [appDestaquePromocao] (@HostBinding para itens < $50)
    │   └── zoom-hover.directive.ts                 # Diretiva [appZoomHover] (@HostListener mouseenter/mouseleave)
    └── pages/
        ├── home/home.page.ts                       # /home: Banner de boas-vindas, chips de categorias e ofertas
        ├── produtos/produtos.page.ts               # /produtos: Catálogo com busca em tempo real e filtros de categoria
        ├── detalhes/detalhes.page.ts               # /detalhes/:id: Parâmetro dinâmico via ActivatedRoute
        ├── carrinho/carrinho.page.ts               # /carrinho: Gestão completa de itens, subtotal e checkout simulado
        ├── equipe/equipe.page.ts                   # /equipe: Painel institucional dos 6 integrantes (3 vertentes)
        └── carrinho-equipe/carrinho-equipe.page.ts # /carrinho-equipe: Página unificada mantida para compatibilidade
```

---

## 👥 Matriz de Responsabilidades da Equipe (6 Integrantes)

| Integrante & Matrícula | Requisito Atribuído | Pontos | 1. O que faz no projeto | 2. Onde está no código | 3. Onde ver e testar em tela |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **1. Sérgio Guilherme F. de Lima**<br>`Matrícula: 01796267` | **Páginas e Roteamento** | 1,0 pt | Organiza a arquitetura Standalone, o menu de abas (`ion-tabs`) e as páginas estilizadas do app. | `app.routes.ts`, `app.component.html` e arquivos `.page.ts/.html` | Navegar pela barra de abas inferior (`ion-tabs`) e alternar entre `/home`, `/produtos`, `/carrinho` e `/equipe`. |
| **2. Jonathan Gustavo Gomes dos Santos (Jônatas)**<br>`Matrícula: 01821597` | **Consumo de API** | 1,5 pt | Realiza requisições HTTP à Fake Store API para buscar produtos, categorias e detalhes. | `produtos-api.service.ts` e `provideHttpClient()` em `main.ts` | Exibir o carregamento dinâmico dos filtros de categoria e catálogo real na vitrine. |
| **3. Emilly Marrocos Mendonça Ciriaco**<br>`Matrícula: 01842163` | **Segundo Service e Página do Carrinho** | 1,0 pt | Gerencia estado reativo, badge de contagem, cálculo de subtotal, persistência local e página do carrinho. | `carrinho-local.service.ts`, `carrinho.page.ts/.html` sob a chave `storehub_carrinho_v1` | Adicionar/remover itens, recarregar a página (F5) e conferir dados somados e persistidos no carrinho. |
| **4. Mylena Monteiro Alves**<br>`Matrícula: 01855595` | **Pipes de Formatação** | 1,0 pt<br>(0,25 cada) | Formata valores em moeda, categorias em caixa alta, resumos de texto e notas em estrelas. | `resumo-texto.pipe.ts`, `avaliacao-estrelas.pipe.ts`, `CurrencyPipe` e `UpperCasePipe` | Verificar nos cards o preço em dólar ($), tags em maiúsculo, textos truncados (...) e estrelas visuais. |
| **5. Felix Luiz Cavalcanti Bomfim Neto**<br>`Matrícula: 01810567` | **Diretivas e Fluxo** | 1,5 pt | Controla renderização limpa (`@if` / `@for`) e estiliza cards com destaque promocional e zoom interativo. | `destaque-promocao.directive.ts`, `zoom-hover.directive.ts` e blocos `@if`/`@for` | Spinner com `@if`, vitrine com `@for`, borda verde em itens < $50 e animação de zoom ao passar o mouse. |
| **6. José Rhawan Michel dos Santos**<br>`Matrícula: 01864924` | **Parâmetro por Rota** | 1,0 pt<br>(Extra) | Transmite o ID do produto clicado para carregar sua página individual exclusiva via rota parametrizada. | Rota `detalhes/:id`, `[routerLink]` nos cards e leitura via `ActivatedRoute` | Clicar em qualquer card de produto e abrir a tela individual com imagem ampliada e especificações. |

---

## 🛠️ Tecnologias e Recursos Implementados

### 1. Consumo da FakeStoreAPI (`ProdutosApiService`)
- `getTodosProdutos(): Observable<Produto[]>`: Obtém a listagem completa de produtos (`GET /products`).
- `getCategorias(): Observable<string[]>`: Lista as categorias existentes (`GET /products/categories`).
- `getProdutoPorId(id: number): Observable<Produto>`: Detalha o produto selecionado (`GET /products/:id`).

### 2. Carrinho Reativo & Persistente (`CarrinhoLocalService`)
- Adição de produtos ou incremento de quantidade.
- Decremento com remoção automática ao atingir 0.
- Exclusão individual e limpeza completa do carrinho.
- Cálculo reativo do total de itens (`totalItens`) e subtotal financeiro (`subtotal`).
- Sincronização automática com `localStorage` sob a chave `storehub_carrinho_v1` resistente a recarregamentos (`F5`).

### 3. Navegação com Abas (`ion-tabs`)
- Aba **Início** (`/home`): Hero banner interativo, chips de categorias e ofertas promocionais.
- Aba **Produtos** (`/produtos`): Catálogo com busca em tempo real (`ion-searchbar`) e segmentos (`ion-segment`).
- Aba **Carrinho** (`/carrinho`): Gestão de quantidades, remoção, subtotal, badge reativo e checkout simulado.
- Aba **Equipe** (`/equipe`): Apresentação dos 6 integrantes com suas respectivas vertentes e regras de apresentação.
- Rota Dinâmica **Detalhes** (`/detalhes/:id`): Tela dedicada do produto selecionado.

### 4. Pipes Customizados & Nativos
- `resumoTexto` (`ResumoTextoPipe`): Trunca textos de títulos e descrições com controle de caracteres.
- `avaliacaoEstrelas` (`AvaliacaoEstrelasPipe`): Converte valores numéricos em estrelas visuais, ex: `★★★★★ (4.6)`.
- `CurrencyPipe` nativo do Angular para formatação de moeda em dólares (`USD`).
- `UpperCasePipe` nativo para padronização de categorias.

### 5. Diretivas Customizadas
- `[appDestaquePromocao]` (`DestaquePromocaoDirective`): Aplica automaticamente borda verde (`#2dd36f`), sombra glow e fundo sutil em produtos com valor inferior a $50.00 usando `@HostBinding`.
- `[appZoomHover]` (`ZoomHoverDirective`): Efeito suave de escala e elevação visual via `@HostListener` (`mouseenter` / `mouseleave`).

---

## 📋 Checklist de Conformidade da Disciplina

- [x] **100% Standalone Components:** Nenhum componente utiliza `NgModule`.
- [x] **Zero ocorrências de `*ngIf` ou `*ngFor`:** 100% migrado para a nova sintaxe nativa `@if` e `@for`.
- [x] **Componentes do Ionic obrigatórios:** `ion-header`, `ion-toolbar`, `ion-content`, `ion-card`, `ion-list`, `ion-badge`, `ion-button` e `ion-tabs`.
- [x] **Abas de navegação:** `ion-tabs` ativo e permitindo navegar livremente entre todas as abas.
- [x] **Página Equipe:** Apresenta os 6 integrantes com nomes completos, fotos/ícones, papéis e o que cada um fez.
- [x] **Rotas Standalone:** `/home`, `/produtos`, `/detalhes/:id`, `/carrinho` e `/equipe` devidamente configuradas.
- [x] **Build de Produção:** Testado e aprovado com sucesso via `npm run build`.

---

## 💻 Como Executar

### 1. Iniciar o servidor de desenvolvimento:
```bash
npm start
# ou
npx ionic serve
```

### 2. Gerar build de produção:
```bash
npm run build
```
