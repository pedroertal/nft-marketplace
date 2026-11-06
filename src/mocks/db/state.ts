import { DbState, createInitialSeed } from './seed';
import { NFT, Cart, CartItem, Quote, Order, Wallet, User } from '@/types/entities';
import { NftQueryParams, PaginatedResponse } from '@/types/api';
import { Decimal } from '@/lib/decimal';
import { StoredUser } from './fixtures/users';

const STORAGE_KEY = '__MSW_DB_SNAPSHOT__';

class MemoryDatabase {
  private state: DbState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DbState {
    if (typeof window === 'undefined') {
      return createInitialSeed();
    }

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DbState = JSON.parse(stored);
        if (!parsed.userNfts) {
          parsed.userNfts = { u1: ['nft-2'], u2: ['nft-1'], u3: [] };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('[MSW DB] Falha ao carregar snapshot do localStorage:', e);
    }

    const initial = createInitialSeed();
    this.saveToStorage(initial);
    return initial;
  }

  private saveToStorage(stateToSave: DbState = this.state): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (e) {
        console.error('[MSW DB] Erro ao persistir estado no localStorage:', e);
      }
    }
  }

  public reset(): void {
    this.state = createInitialSeed();
    this.saveToStorage();
    console.info('[MSW DB] Banco em memória reiniciado para o seed original.');
  }

  // --- Auth / Usuários ---
  public getUsers(): StoredUser[] {
    return this.state.users;
  }

  public findUserById(id: string): StoredUser | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public findUserByEmail(email: string): StoredUser | undefined {
    return this.state.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  public createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'collector' | 'creator';
  }): StoredUser {
    const newUser: StoredUser = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role || 'collector',
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${userData.email}`,
      bio: 'Colecionador recém-chegado ao NFT Nexus.',
      createdAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const userIndex = this.state.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    this.state.users[userIndex] = {
      ...this.state.users[userIndex],
      ...updates,
    };
    this.saveToStorage();
    const { passwordHash: _, ...safeUser } = this.state.users[userIndex];
    return safeUser;
  }

  // --- Catálogo e NFTs ---
  public getNfts(params: NftQueryParams = {}): PaginatedResponse<NFT> {
    const {
      search = '',
      category,
      sort = 'newest',
      page = 1,
      limit = 8,
      minPrice,
      maxPrice,
    } = params;

    let items = [...this.state.nfts];

    // Busca textual (título, descrição, nome do criador)
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(
        (nft) =>
          nft.title.toLowerCase().includes(q) ||
          nft.description.toLowerCase().includes(q) ||
          nft.creator.name.toLowerCase().includes(q)
      );
    }

    // Filtro de categoria
    if (category && category !== 'All') {
      items = items.filter((nft) => nft.category === category);
    }

    // Filtro de faixa de preço em ETH
    if (minPrice && !isNaN(parseFloat(minPrice))) {
      items = items.filter((nft) =>
        Decimal.isGreaterThan(nft.price, minPrice) ||
        Decimal.isEqualTo(nft.price, minPrice)
      );
    }
    if (maxPrice && !isNaN(parseFloat(maxPrice))) {
      items = items.filter((nft) =>
        Decimal.isLessThan(nft.price, maxPrice) ||
        Decimal.isEqualTo(nft.price, maxPrice)
      );
    }

    // Ordenação estrita
    items.sort((a, b) => {
      switch (sort) {
        case 'price_asc':
          return Decimal.compare(a.price, b.price);
        case 'price_desc':
          return Decimal.compare(b.price, a.price);
        case 'editions_desc':
          return b.availableEditions - a.availableEditions;
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    const total = items.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedItems = items.slice(start, start + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages,
      limit,
    };
  }

  public getNftById(id: string): NFT | undefined {
    return this.state.nfts.find((n) => n.id === id);
  }

  public updateNft(id: string, updates: Partial<NFT>): NFT | null {
    const idx = this.state.nfts.findIndex((n) => n.id === id);
    if (idx === -1) return null;

    const current = this.state.nfts[idx];
    const updated: NFT = {
      ...current,
      ...updates,
      version: current.version + 1, // Incremento estrito de versão
    };

    this.state.nfts[idx] = updated;
    this.saveToStorage();
    return updated;
  }

  // --- Favoritos ---
  public getFavorites(userId: string = 'u1'): string[] {
    return this.state.favorites[userId] || [];
  }

  public toggleFavorite(userId: string = 'u1', nftId: string): boolean {
    const userFavs = this.state.favorites[userId] || [];
    const exists = userFavs.includes(nftId);
    let newFavs: string[];

    if (exists) {
      newFavs = userFavs.filter((id) => id !== nftId);
    } else {
      newFavs = [...userFavs, nftId];
    }

    this.state.favorites[userId] = newFavs;
    this.saveToStorage();
    return !exists;
  }

  // --- Carrinho ---
  public getCart(): Cart {
    return this.state.cart;
  }

  public addToCart(nftId: string, quantity: number = 1): Cart {
    const nft = this.getNftById(nftId);
    if (!nft) throw new Error('NFT não encontrado');

    const existingIdx = this.state.cart.items.findIndex(
      (item) => item.nftId === nftId
    );

    if (existingIdx > -1) {
      const current = this.state.cart.items[existingIdx];
      const newQty = current.quantity + quantity;
      this.state.cart.items[existingIdx].quantity = Math.min(
        newQty,
        nft.availableEditions
      );
    } else {
      const newItem: CartItem = {
        nftId: nft.id,
        edition: 1,
        quantity: Math.min(quantity, Math.max(nft.availableEditions, 1)),
        unitPrice: nft.price,
        title: nft.title,
        image: nft.image,
        creatorName: nft.creator.name,
        availableEditions: nft.availableEditions,
      };
      this.state.cart.items.push(newItem);
    }

    this.state.cart.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return this.state.cart;
  }

  public updateCartItem(nftId: string, quantity: number): Cart {
    if (quantity <= 0) {
      return this.removeFromCart(nftId);
    }

    const item = this.state.cart.items.find((i) => i.nftId === nftId);
    if (item) {
      item.quantity = quantity;
      this.state.cart.updatedAt = new Date().toISOString();
      this.saveToStorage();
    }
    return this.state.cart;
  }

  public removeFromCart(nftId: string): Cart {
    this.state.cart.items = this.state.cart.items.filter(
      (i) => i.nftId !== nftId
    );
    this.state.cart.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return this.state.cart;
  }

  public clearCart(): Cart {
    this.state.cart.items = [];
    this.state.cart.updatedAt = new Date().toISOString();
    this.saveToStorage();
    return this.state.cart;
  }

  // --- Cotação (Quote) ---
  public createQuote(
    itemsOverride?: Array<{ nftId: string; quantity: number }>,
    couponCode?: string
  ): Quote {
    let itemsToQuote: CartItem[] = [];

    if (itemsOverride && itemsOverride.length > 0) {
      itemsToQuote = itemsOverride.map((ov) => {
        const nft = this.getNftById(ov.nftId);
        return {
          nftId: ov.nftId,
          edition: 1,
          quantity: ov.quantity,
          unitPrice: nft ? nft.price : '0.0000',
          title: nft ? nft.title : 'Item',
          image: nft ? nft.image : '',
          creatorName: nft ? nft.creator.name : '',
          availableEditions: nft ? nft.availableEditions : 1,
        };
      });
    } else {
      itemsToQuote = this.state.cart.items;
    }

    let subtotal = '0';
    for (const item of itemsToQuote) {
      const lineTotal = Decimal.mul(item.unitPrice, item.quantity);
      subtotal = Decimal.add(subtotal, lineTotal);
    }

    // Cupons aceitos: NEXUS10 (10% desconto), CRYPTO20 (20% desconto)
    let discount = '0';
    const normalizedCoupon = (couponCode || '').trim().toUpperCase();
    if (normalizedCoupon === 'NEXUS10') {
      discount = Decimal.mul(subtotal, '0.10');
    } else if (normalizedCoupon === 'CRYPTO20') {
      discount = Decimal.mul(subtotal, '0.20');
    }

    const networkFee = Decimal.toEthString('0.0120'); // Taxa de rede fixa para estimativa
    const subtotalAfterDiscount = Decimal.sub(subtotal, discount);
    const total = Decimal.add(
      Decimal.isGreaterThan(subtotalAfterDiscount, '0')
        ? subtotalAfterDiscount
        : '0',
      networkFee
    );

    const quoteId = `q-${Date.now()}`;
    const quote: Quote = {
      quoteId,
      subtotal: Decimal.toEthString(subtotal),
      discount: Decimal.toEthString(discount),
      couponCode: normalizedCoupon || undefined,
      networkFee,
      total: Decimal.toEthString(total),
      validUntil: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      expiresIn: 900,
      itemsSnapshot: JSON.parse(JSON.stringify(itemsToQuote)),
    };

    this.state.quotes[quoteId] = quote;
    this.saveToStorage();
    return quote;
  }

  public getQuote(quoteId: string): Quote | undefined {
    return this.state.quotes[quoteId];
  }

  // --- Idempotência e Pedidos ---
  public checkIdempotency(
    key: string,
    currentPayload: any
  ): {
    cached: boolean;
    conflict: boolean;
    response?: any;
    statusCode?: number;
  } {
    if (!key) return { cached: false, conflict: false };

    const entry = this.state.idempotencyMap[key];
    if (!entry) {
      return { cached: false, conflict: false };
    }

    const currentHash = JSON.stringify(currentPayload);
    if (entry.payloadHash === currentHash) {
      return {
        cached: true,
        conflict: false,
        response: entry.response,
        statusCode: entry.statusCode,
      };
    } else {
      return {
        cached: false,
        conflict: true,
      };
    }
  }

  public recordIdempotency(
    key: string,
    payload: any,
    response: any,
    statusCode: number = 200
  ): void {
    if (!key) return;
    this.state.idempotencyMap[key] = {
      payloadHash: JSON.stringify(payload),
      response,
      statusCode,
      timestamp: Date.now(),
    };
    this.saveToStorage();
  }

  public createOrder(data: {
    quoteId: string;
    walletAddress: string;
    network: string;
    idempotencyKey: string;
    userId?: string;
  }): Order {
    const quote = this.getQuote(data.quoteId) || this.createQuote();
    const orderId = `ord-${Date.now()}`;

    // Subtrai as edições compradas dos NFTs no catálogo
    const itemsPurchased = quote.itemsSnapshot || this.state.cart.items;
    for (const item of itemsPurchased) {
      const nft = this.getNftById(item.nftId);
      if (nft) {
        const remaining = Math.max(0, nft.availableEditions - item.quantity);
        this.updateNft(nft.id, {
          availableEditions: remaining,
          status: remaining === 0 ? 'SOLD_OUT' : 'ACTIVE',
        });
      }
    }

    // 1. Debita dinamicamente o saldo da carteira utilizada na compra
    const targetAddress = data.walletAddress?.toLowerCase();
    const targetWallet =
      this.state.wallets.find((w) => w.address.toLowerCase() === targetAddress) ||
      this.state.wallets.find((w) => w.isDefault) ||
      this.state.wallets[0];

    if (targetWallet && targetWallet.balance) {
      const currentBalance = targetWallet.balance;
      const orderTotal = quote.total || '0.0000';
      const newBalance = Decimal.sub(currentBalance, orderTotal);
      targetWallet.balance = Decimal.isGreaterThan(newBalance, '0')
        ? Decimal.toEthString(newBalance)
        : '0.0000';
      console.info(
        `[MSW DB] Saldo da carteira ${targetWallet.address} debitado: ${currentBalance} ETH -> ${targetWallet.balance} ETH (Pedido: ${orderTotal} ETH)`
      );
    }

    // 2. Adiciona os NFTs adquiridos ao array de colecionáveis do usuário logado
    const buyerId = data.userId || 'u1';
    if (!this.state.userNfts) {
      this.state.userNfts = {};
    }
    if (!this.state.userNfts[buyerId]) {
      this.state.userNfts[buyerId] = [];
    }

    for (const item of itemsPurchased) {
      if (!this.state.userNfts[buyerId].includes(item.nftId)) {
        this.state.userNfts[buyerId].push(item.nftId);
        console.info(
          `[MSW DB] NFT #${item.nftId} ("${item.title}") adicionado à coleção de "Meus NFTs" do usuário ${buyerId}.`
        );
      }
    }

    const order: Order = {
      orderId,
      quoteId: data.quoteId,
      idempotencyKey: data.idempotencyKey,
      status: 'CONFIRMED',
      total: quote.total,
      walletAddress: data.walletAddress,
      network: data.network || 'Ethereum',
      txHash: `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`,
      createdAt: new Date().toISOString(),
      snapshot: {
        items: JSON.parse(JSON.stringify(itemsPurchased)),
        quote: JSON.parse(JSON.stringify(quote)),
      },
    };

    this.state.orders[orderId] = order;
    // Esvazia os itens do carrinho após compra confirmada
    this.clearCart();
    this.saveToStorage();
    return order;
  }

  public getOrder(orderId: string): Order | undefined {
    return this.state.orders[orderId];
  }

  public getOrders(): Order[] {
    return Object.values(this.state.orders).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- Coleção de NFTs do Usuário (Meus NFTs) ---
  public getUserNftIds(userId: string = 'u1'): string[] {
    if (!this.state.userNfts) this.state.userNfts = {};
    return this.state.userNfts[userId] || [];
  }

  public getUserNfts(userId: string = 'u1'): NFT[] {
    const nftIds = this.getUserNftIds(userId);
    return nftIds
      .map((id) => this.getNftById(id))
      .filter((n): n is NFT => Boolean(n));
  }

  // --- Carteiras ---
  public getWallets(): Wallet[] {
    return this.state.wallets;
  }

  public addWallet(data: {
    address: string;
    type: 'PRIMARY' | 'SECONDARY';
    network: string;
  }): Wallet {
    const id = `w-${Date.now()}`;
    const newWallet: Wallet = {
      id,
      address: data.address,
      type: data.type,
      network: data.network,
      balance: '1.0000',
      isDefault: data.type === 'PRIMARY',
      createdAt: new Date().toISOString(),
    };

    if (data.type === 'PRIMARY') {
      this.state.wallets.forEach((w) => {
        w.isDefault = false;
        if (w.type === 'PRIMARY') w.type = 'SECONDARY';
      });
    }

    this.state.wallets.push(newWallet);
    this.saveToStorage();
    return newWallet;
  }
}

export const db = new MemoryDatabase();
