const seed = require("../db/seeds/seed");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");
const db = require("../db/connection");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));

afterAll(() => {
  if (db.end) db.end();
});

describe("3. GET /api/categories", () => {
  test("Responds with an array containing categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toBeInstanceOf(Array);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

//404 not found
describe("3. GET ERRORS", () => {
  test("Responds with a 404 error when passed an invalid path", () => {
    return request(app).get("/api/categoriez").expect(404);
  });
});
