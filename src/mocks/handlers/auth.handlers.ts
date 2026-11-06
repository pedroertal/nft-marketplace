import { http, HttpResponse } from 'msw';
import { db } from '../db/state';
import { LoginPayload, RegisterPayload } from '@/types/api';

export const authHandlers = [
  // Login com e-mail e senha
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginPayload;
    const { email, password } = body;

    const user = db.findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return HttpResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'E-mail ou senha incorretos.',
        },
        { status: 401 }
      );
    }

    const token = `jwt_mock_${user.id}_${Date.now()}`;
    const { passwordHash: _, ...safeUser } = user;

    return HttpResponse.json({
      token,
      user: safeUser,
    });
  }),

  // Criação de conta
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as RegisterPayload;
    const { email, password, name, role } = body;

    const existing = db.findUserByEmail(email);
    if (existing) {
      return HttpResponse.json(
        {
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Um usuário com este e-mail já existe.',
        },
        { status: 409 }
      );
    }

    const newUser = db.createUser({
      name,
      email,
      passwordHash: password,
      role: role || 'collector',
    });

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    const { passwordHash: _, ...safeUser } = newUser;

    return HttpResponse.json(
      {
        token,
        user: safeUser,
      },
      { status: 201 }
    );
  }),

  // Sessão atual via Bearer Token
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'Token de autenticação ausente ou inválido.',
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    // Extrai o userId do mock token (jwt_mock_{userId}_{timestamp})
    const parts = token.split('_');
    const userId = parts[2] || 'u1';

    const user = db.findUserById(userId) || db.getUsers()[0];
    if (!user) {
      return HttpResponse.json(
        { code: 'USER_NOT_FOUND', message: 'Usuário não localizado.' },
        { status: 404 }
      );
    }

    const { passwordHash: _, ...safeUser } = user;
    return HttpResponse.json({ user: safeUser });
  }),

  // Logout
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];
