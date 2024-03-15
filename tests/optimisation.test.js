const request = require('supertest');
const app = require('../amplify/backend/function/testLambda/src/app.js');

describe('Speed Tests', () => {

  test('GET /items/allIncomes speed', async () => {
    const start = Date.now();
    await request(app).get('/items/allIncomes?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/allIncomes took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/all speed', async () => {
    const start = Date.now();
    await request(app).get('/items/all?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/all took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/UoA speed', async () => {
    const start = Date.now();
    await request(app).get('/items/UoA?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/UoA took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/top3 for Law speed', async () => {
    const start = Date.now();
    await request(app).get('/items/top3?uofaName=Law');
    const duration = Date.now() - start;
    console.log(`GET /items/top3 for Law took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/bottom3 for Clinical Medicine speed', async () => {
    const start = Date.now();
    await request(app).get('/items/bottom3?uofaName=Clinical Medicine');
    const duration = Date.now() - start;
    console.log(`GET /items/bottom3 for Clinical Medicine took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/outputs speed', async () => {
    const start = Date.now();
    await request(app).get('/items/outputs?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/outputs took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/overall speed', async () => {
    const start = Date.now();
    await request(app).get('/items/overall?unitOfAssessment=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/overall took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/environment speed', async () => {
    const start = Date.now();
    await request(app).get('/items/environment?uoaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/environment took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/income speed', async () => {
    const start = Date.now();
    await request(app).get('/items/income?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/income took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/uniNames speed', async () => {
    const start = Date.now();
    await request(app).get('/items/uniNames');
    const duration = Date.now() - start;
    console.log(`GET /items/uniNames took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/uoaUniNames speed', async () => {
    const start = Date.now();
    await request(app).get('/items/uoaUniNames?uofaName=Biological Sciences');
    const duration = Date.now() - start;
    console.log(`GET /items/uoaUniNames took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/university speed', async () => {
    const start = Date.now();
    await request(app).get('/items/university?UniversityName=Bangor University');
    const duration = Date.now() - start;
    console.log(`GET /items/university took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/search speed', async () => {
    const start = Date.now();
    await request(app).get('/items/search?query=University of St Andrews&unitOfAssessment=Physics');
    const duration = Date.now() - start;
    console.log(`GET /items/search took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/unitofassessment speed', async () => {
    const start = Date.now();
    await request(app).get('/items/unitofassessment?uofaName=Computer Science and Informatics');
    const duration = Date.now() - start;
    console.log(`GET /items/unitofassessment took ${duration}ms`);
    expect(duration).toBeLessThan(2000);
  });

});
describe('Endpoint Query Edge Case Tests with Timing', () => {

  test('GET /items/allIncomes with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/allIncomes?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/all with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/all?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/UoA with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/UoA?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/top3 with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/top3?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/bottom3 with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/bottom3?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/outputs with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/outputs?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/overall with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/overall?unitOfAssessment=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/environment with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/environment?uoaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/income with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/income?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/uoaUniNames with empty query value speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/uoaUniNames?uofaName=');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/university with query value as "Nation" speed', async () => {
    const start = Date.now();
    const response = await request(app).get('/items/university?UniversityName=Nation');
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

  test('GET /items/search with specific uni name but no UoA speed', async () => {
    const universityName = 'University of Example';
    const start = Date.now();
    const response = await request(app).get(`/items/search?query=${universityName}`);
    const duration = Date.now() - start;
    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(2000);
  });

});
