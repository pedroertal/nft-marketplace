import { authHandlers } from './auth.handlers';
import { nftsHandlers } from './nfts.handlers';
import { cartHandlers } from './cart.handlers';
import { ordersHandlers } from './orders.handlers';
import { profileHandlers } from './profile.handlers';
import { testHandlers } from './test.handlers';

export const handlers = [
  ...authHandlers,
  ...nftsHandlers,
  ...cartHandlers,
  ...ordersHandlers,
  ...profileHandlers,
  ...testHandlers,
];
