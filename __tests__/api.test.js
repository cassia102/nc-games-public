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

//GET TESTS
describe("3. GET /api/categories", () => {
  test("Responds with an array containing categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        const { categories } = body;
        expect(categories).toHaveLength(4);
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

describe("3. GET /api/reviews/:review_id", () => {
  test("Responds with an array containing relevant review from ID passed in", () => {
    return request(app)
      .get("/api/reviews/10")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 10,
              title: "Build you own tour de Yorkshire",
              review_body:
                "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ",
              designer: "Asger Harding Granerud",
              review_img_url:
                "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              votes: 10,
              category: "social deduction",
              owner: "mallionaire",
              created_at: "2021-01-18T10:01:41.251Z",
            })
          );
        });
      });
  });
});

//ERROR HANDLERS
describe("3. GET ERRORS", () => {
  test("Responds with a 404 not found when passed an invalid path", () => {
    return request(app)
      .get("/api/categoriez")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path");
      });
  });
  test("Responds with a 404 not found when passed an id that does not exist", () => {
    return request(app)
      .get("/api/reviews/42")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 42");
      });
  });
  test("Responds with a 400 Bad request when passed an invalid review_id type", () => {
    return request(app)
      .get("/api/reviews/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});
