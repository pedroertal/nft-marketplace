import { http, HttpResponse } from 'msw';
import { db } from '../db/state';

export const testHandlers = [
  // Endpoint de utilidade para testes Playwright e reset de suites
  http.post('/api/__test/reset', () => {
    db.reset();
    return HttpResponse.json({
      success: true,
      message: 'Banco de dados MSW restaurado com sucesso para o seed inicial.',
      timestamp: new Date().toISOString(),
    });
  }),
];
