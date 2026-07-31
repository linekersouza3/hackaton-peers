const request = require('supertest');
const app = require('../server');

describe('LogiTrack API', () => {
  test('GET /health retorna status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /esteiras retorna lista de esteiras', async () => {
    const res = await request(app).get('/esteiras');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /esteiras/:id retorna 404 para id inexistente', async () => {
    const res = await request(app).get('/esteiras/999');
    expect(res.statusCode).toBe(404);
  });
});
