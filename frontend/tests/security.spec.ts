import { test, expect } from '@playwright/test';
import jwt from 'jsonwebtoken';


test.describe('StreetCats API & Test di Sicurezza', () => {

  const API_URL = 'http://localhost:3000/api';

  let testUser = null;

  // --------------------------------------------------
  //  HELPERS
  // --------------------------------------------------

  async function createTestUser(request) {
    const uniqueName = `test_${Date.now()}`;

    const user = {
      username: uniqueName,
      email: `${uniqueName}@test.com`,
      password: 'Password123'
    };

    await request.post(`${API_URL}/auth/register`, { data: user });

    const loginRes = await request.post(`${API_URL}/auth/login`, {
      data: {
        email: user.email,
        password: user.password
      }
    });

    const body = await loginRes.json();

    return {
      ...user,
      token: body.token
    };
  }

  async function post(request, url, data, token) {
    return request.post(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      data
    });
  }

  async function get(request, url, token) {
    return request.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }

  // --------------------------------------------------
  //  CLEANUP
  // --------------------------------------------------

  test.afterEach(async ({ request }) => {
    if (testUser?.token) {
      await request.delete(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${testUser.token}` }
      });
      testUser = null;
    }
  });

  // --------------------------------------------------
  //  TESTS
  // --------------------------------------------------

  test('dovrebbe bloccare i tentativi di Sql Injection al login', async ({ request }) => {
    const payloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "' OR 1=1 --"
    ];

    for (const payload of payloads) {
      const response = await post(request, `${API_URL}/auth/login`, {
        email: payload,
        password: 'random_password'
      });

      const body = await response.json().catch(() => ({}));

      expect([400, 401]).toContain(response.status());
      expect(body.token).toBeUndefined();
    }
  });

  // --------------------------------------------------

  test('dovrebbe rifiutare i token JWT invalidi', async ({ request }) => {
    const fakeToken = "ey.fake.token";

    const response = await post(
      request,
      `${API_URL}/cats/1/comments`,
      { content: 'Hackero il pianeta' },
      fakeToken
    );

    expect(response.status()).toBe(401);

  });

  // --------------------------------------------------
test('dovrebbe rifiutare i token JWT scaduti', async ({ request }) => {
    const secret = 'unasegretissima_chiave_per_i_tuoi_token_streetcats';

    const expiredToken = jwt.sign(
      { id: 999, username: 'test_expired' }, // Payload fittizio
      secret,
      { expiresIn: '-1h' }
    );

    //  Invio la richiesta con il vero token scaduto
    const response = await post(
      request,
      `${API_URL}/cats/1/comments`,
      { content: 'test' },
      expiredToken
    );

    // il middleware dovrebbe rifiutare il token scaduto
    expect(response.status()).toBe(401);
  });

  // --------------------------------------------------

test('dovrebbe impedire la registrazione di utenti duplicati', async ({ request }) => {

   testUser = await createTestUser(request);

   const duplicatePayload = {
      username: testUser.username,
      email: testUser.email,
      password: 'password123'
    };

    const response = await post(request, `${API_URL}/auth/register`, duplicatePayload);
    const body = await response.json().catch(() => ({}));

    console.log('Risposta per utente duplicato:', body);
    expect(response.status()).toBe(400);
    expect(body.error).toMatch(/già|uso/i);
  });

  // --------------------------------------------------

test('È necessario sanificare i payload XSS memorizzati', async ({ request }) => {
  testUser = await createTestUser(request);

  const payload = "<script>alert('xss')</script>";

  await post(
    request,
    `${API_URL}/cats/1/comments`,
    { content: payload },
    testUser.token
  );

  const response = await get(request, `${API_URL}/cats/1/comments`);
  const body = await response.json();

  const lastComment = body[body.length - 1];
  expect(lastComment.content).not.toContain("<script>");
});
  // --------------------------------------------------

test('dovrebbe applicare una rigorosa politica di CORS', async ({ request }) => {
    const response = await request.fetch(`${API_URL}/cats`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'http://malicious-site.com',
        'Access-Control-Request-Method': 'POST'
      }
    });

    const allowOrigin = response.headers()['access-control-allow-origin'];
    console.log('Allow-Origin restituito:', allowOrigin);

    expect(allowOrigin).not.toBe('http://malicious-site.com');

    expect([undefined, 'http://localhost:4200']).toContain(allowOrigin);
  });

  // --------------------------------------------------

 test('dovrebbe limitare la frequenza degli accessi al login', async ({ request }) => {
  let status;
   for (let i = 0; i < 11; i++) {
    const response = await post(request, `${API_URL}/auth/login`, {
      email: 'hacker@malicious.com',
      password: 'wrong_password'
    });
    status = response.status();
  }
   expect(status).toBe(429);
});

  // --------------------------------------------------

  test('dovrebbe validare i dati in input', async ({ request }) => {
    const response = await post(request, `${API_URL}/auth/register`, {
      username: '',
      email: 'invalid-email',
      password: ''
    });

    expect(response.status()).toBe(400);
  });

  // --------------------------------------------------

  test('dovrebbe impedire accesso non autorizzato alle rotte protette', async ({ request }) => {
      const response = await request.post(`${API_URL}/cats/1/comments`, {
      data: { content: 'Sono un hacker senza token' }

    });

    expect([401, 403]).toContain(response.status());
  });
});
