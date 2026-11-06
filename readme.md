# NFT Nexus — Marketplace de NFTs

Aplicação web desenvolvida em React e TypeScript para catálogo, negociação e liquidação simulada de NFTs (tokens não-fungíveis). O projeto simula a experiência completa de um marketplace descentralizado (Web3), com foco em precisão matemática para valores em criptoativos, sincronização de filtros na URL, persistência de dados no navegador e testes ponta a ponta automatizados.

---

## Tecnologias Utilizadas

- **Core:** React 18, TypeScript, Vite
- **Roteamento:** TanStack Router (rotas tipadas por arquivo e filtros sincronizados na URL via search params)
- **Gerenciamento de Estado e Cache de Servidor:** TanStack Query v5 (React Query)
- **Estilização e UI:** Tailwind CSS, Radix UI (primitivas acessíveis), Lucide Icons e Sonner (notificações toast)
- **Aritmética Financeira:** BigNumber.js (operações decimais seguras com valores em ETH, evitando imprecisões de ponto flutuante binário)
- **Camada de Mocks:** Mock Service Worker (MSW v2) com banco de dados em memória persistido em `localStorage` e simulador de WebSocket/Socket.IO
- **Validação de Formulários:** Zod
- **Testes Ponta a Ponta (E2E):** Playwright executando em Chromium

---

## Principais Funcionalidades

### 1. Catálogo com Filtros na URL
- Busca textual com debounce de 300ms.
- Filtros combinados por categoria, ordenação (preço, mais recentes) e paginação.
- O estado dos filtros é armazenado diretamente nos query params da URL (ex: `/?search=cyber&category=Digital%20Art`), permitindo compartilhamento de links e sobrevivência ao recarregar a página (`F5`).

### 2. Carrinho de Compras e Cotação
- Controle de quantidade e remoção de itens.
- Aplicação de cupons de desconto (`NEXUS10` para 10% OFF, `CRYPTO20` para 20% OFF).
- Subtotal, desconto, taxa estimada de rede (gas) e total calculados com precisão decimal em ETH.
- Transição controlada para o checkout sem flicker ou telas intermediárias de carrinho vazio.

### 3. Checkout Seguro com Idempotência
- Injeção automática do cabeçalho `Idempotency-Key` (RFC4122 UUIDv4) na requisição `POST /api/orders`.
- Se a mesma chave for reenviada com o mesmo payload, a API devolve a resposta original em cache sem duplicar a cobrança.
- Se a mesma chave for reenviada com payload diferente, o backend rejeita com status `409 Conflict`.
- Botão de confirmação com estado de loading imediato (`disabled` com spinner e texto "Processando Transação..."), prevenindo múltiplos envios concorrentes.

### 4. Recibo de Compra Imutável
- Exibição de hash simulado de transação blockchain (TxHash), timestamp e snapshot congelado dos itens no instante exato da compra.
- Alterações posteriores no catálogo não corrompem os dados do recibo histórico.

### 5. Painel de Perfil e Custódia de NFTs
- Saldo consolidado em ETH atualizado e debitado dinamicamente após a conclusão do pedido.
- Aba **Meus NFTs** que reflete imediatamente os itens adquiridos sob custódia do usuário logado.
- Gestão de carteiras Web3 (principal e secundária) com validação de formato hexadecimal (`0x...`).
- Histórico de transações e lista de favoritos com mutação otimista.

### 6. Reconciliação em Tempo Real (Mock Socket.IO)
- Simulação de eventos `nft.updated` emitidos pelo criador (ex: alteração de preço de um item que já está no carrinho do usuário).
- Alerta visual no card do item e bloqueio preventivo do checkout até que o comprador aceite explicitamente o novo valor.
- Descarte de eventos obsoletos ou fora de ordem via controle sequencial de versão (`version`).

---

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18.0.0 ou superior)
- npm (versão 9.0.0 ou superior)

### 1. Clonar o repositório e instalar dependências
```bash
git clone <url-do-repositorio>
cd "Marketplace de NFTs"
npm install
```

### 2. Rodar a aplicação em desenvolvimento
```bash
npm run dev
```
Abra o navegador em `http://localhost:3000`.

### 3. Executar os testes ponta a ponta (Playwright)
```bash
npm run test:e2e
```
Para executar no modo interativo do Playwright:
```bash
npx playwright test --ui
```

### 4. Verificar tipagem TypeScript (Type-Check)
```bash
npm run lint
```

### 5. Gerar build de produção
```bash
npm run build
```

---

## Cenários Cobertos nos Testes E2E (Playwright)

| Arquivo de Teste | Cenário |
| :--- | :--- |
| `e2e/checkout-flow.spec.ts` | Fluxo completo: login, busca no catálogo, adição ao carrinho, aplicação de cupom, checkout idempotente e conferência de recibo |
| `e2e/checkout-persistence.spec.ts` | Validação de persistência pós-compra: débito dinâmico do saldo da carteira e exibição da obra na aba "Meus NFTs" |
| `e2e/idempotency.spec.ts` | Cache de resposta para requisições repetidas com mesma chave e proteção contra conflito (`409 Conflict`) |
| `e2e/realtime-reconciliation.spec.ts` | Detecção de mudança de preço via WebSocket simulado, alerta no carrinho e bloqueio de checkout até aceite |
| `e2e/catalog-filters.spec.ts` | Sincronização de busca com debounce, filtros de categoria e persistência dos parâmetros na URL pós-F5 |

---

## Credenciais para Teste Rápido

O banco em memória já inicia pré-configurado com os seguintes usuários:

| Perfil | E-mail | Senha | Carteira Inicial (Saldo) |
| :--- | :--- | :--- | :--- |
| **Colecionador** | `pedro@nexus.io` | `password123` | `0x71C8...5a72` (4.85 ETH) |
| **Criadora** | `ana@nexus.io` | `password123` | `0x324D...7431` (12.40 ETH) |

**Cupons de Desconto Disponíveis:**
- `NEXUS10` — 10% de desconto no subtotal
- `CRYPTO20` — 20% de desconto no subtotal

---

## Estrutura do Código

```text
src/
├── app/              # Bootstrap da aplicação, contexto de autenticação e providers
├── components/       # Componentes de layout (Navbar, Footer, MobileNav) e UI (Radix/shadcn)
├── features/         # Módulos verticais organizados por domínio:
│   ├── auth/         # Login, registro e schemas Zod
│   ├── catalog/      # Cards, grid, filtros laterais e detalhes do NFT
│   ├── cart/         # Linhas do carrinho, cupons, resumo e hook de reconciliação
│   ├── checkout/     # Formulário de checkout, idempotência e seletor de carteira
│   └── profile/      # Dashboard, carteiras e hooks de busca de NFTs do usuário
├── lib/              # Cliente Axios com interceptors, cliente Socket.IO e módulo Decimal
├── mocks/            # Handlers MSW, fixtures, snapshot em localStorage e mock de socket
├── routes/           # Rotas do TanStack Router baseadas em arquivo
└── types/            # Definições de entidades, envelopes de API e eventos
```

---

## Licença

Projeto desenvolvido sob a licença [MIT](LICENSE).
