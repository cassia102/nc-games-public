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
describe("GET /api", () => {
  test("Responds with a list of all the endpoints available", () => {
    return request(app).get("/api").expect(Array);
  });
});
describe("GET /api/categories", () => {
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
  test("ERROR 404: Responds with a 404 not found when passed an invalid path", () => {
    return request(app)
      .get("/api/categoriez")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path");
      });
  });
});

describe("GET /api/reviews/:review_id (comment count)", () => {
  test("Responds with an array containing relevant review including the comment count from the ID passed in", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(1);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: 2,
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: "2021-01-18T10:01:41.251Z",
              votes: 5,
              comment_count: 3,
            })
          );
        });
      });
  });
  test("ERROR 404 Responds with a 404 not found when passed an id that does not exist", () => {
    return request(app)
      .get("/api/reviews/42")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No review found for review_id: 42");
      });
  });
  test("ERROR 400: Responds with a 400 Bad request when passed an invalid review_id type", () => {
    return request(app)
      .get("/api/reviews/not_a_number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
});

describe("GET /api/reviews (comment count)", () => {
  test("Responds with an array containing relevant review including the comment count from the review ID", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        const { reviews } = body;
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              review_body: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("Test the reviews are returned in date desc order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Test the reviews are returned in title desc order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("Test the reviews are returns in asc order if query is added", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("Returns the reviews filtered by query category", () => {
    return request(app)
      .get("/api/reviews?category=social+deduction")
      .expect(200)
      .then(({ body: { reviews } }) => {
        expect(reviews).toHaveLength(11);
      });
  });
  test("ERROR 400: if passed a non valid order query", () => {
    return request(app)
      .get("/api/reviews?order=invalid_order")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid order query");
      });
  });
  test("ERROR 400: if passed a non valid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=invalid_sort_by")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid sort_by query");
      });
  });
  test("ERROR 400: if passed a non valid filter query", () => {
    return request(app)
      .get("/api/reviews?category=invalid_category")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No category found for: invalid_category");
      });
  });
  test("ERROR 404: Responds with a 404 not found when passed an invalid path", () => {
    return request(app)
      .get("/api/reviewzzz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path");
      });
  });
});

describe("GET /api/users", () => {
  test("Responds with an object containing the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
  test("ERROR 404: Responds with a 404 not found when passed an invalid path", () => {
    return request(app)
      .get("/api/userzzz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Path");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("Responds with an array containing relevant comments  ID passed in", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(3);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: 2,
              created_at: expect.any(String),
            })
          );
        });
      });
  });
  test("ERROR 404 Responds with a 404 not found when passed an id that does not exist or does not have any reviews", () => {
    return request(app)
      .get("/api/reviews/42/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comments found for review_id: 42");
      });
  });
  test("ERROR 400: Responds with a 400 Bad request when passed an invalid review_id type", () => {
    return request(app)
      .get("/api/reviews/not_a_number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("200 Responds with an empty array if the review_id exists but has no comments", () => {
    return request(app)
      .get("/api/reviews/10/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("Responds with the object showing the votes amended with positve vote", () => {
    const newVotes = { inc_votes: 10 };
    return request(app)
      .patch("/api/reviews/10")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual({
          review_id: 10,
          title: "Build you own tour de Yorkshire",
          designer: "Asger Harding Granerud",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 20,
        });
      });
  });
  test("Responds with the object showing the votes amended with negative vote", () => {
    const newVotes = { inc_votes: -100 };
    return request(app)
      .patch("/api/reviews/10")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual({
          review_id: 10,
          title: "Build you own tour de Yorkshire",
          designer: "Asger Harding Granerud",
          owner: "mallionaire",
          review_img_url:
            "https://images.pexels.com/photos/258045/pexels-photo-258045.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          review_body:
            "Cold rain pours on the faces of your team of cyclists, you pulled to the front of the pack early and now your taking on exhaustion cards like there is not tomorrow, you think there are about 2 hands left until you cross the finish line, will you draw enough from your deck to cross before the other team shoot passed? Flamee Rouge is a Racing deck management game where you carefully manage your deck in order to cross the line before your opponents, cyclist can fall slyly behind front runners in their slipstreams to save precious energy for the prefect moment to burst into the lead ",
          category: "social deduction",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: -90,
        });
      });
  });
  test("ERROR 400: Responds with a 400 error when passed a body with malformed/missing fields", () => {
    const newVotes = {};
    return request(app)
      .patch("/api/reviews/10")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing or incorrect fields required in body");
      });
  });
  test("ERROR 400: Responds with a 400 error when passed a body with incorrect type", () => {
    const newVotes = { inc_votes: "ten" };
    return request(app)
      .patch("/api/reviews/10")
      .send(newVotes)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing or incorrect fields required in body");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("Posts a new comment and responds with comment object", () => {
    const newComment = {
      username: "dav3rid",
      body: "Fusce sodales, nibh at fringilla imperdiet, felis est malesuada neque, vitae elementum.",
    };
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comments).toEqual({
          comment_id: 7,
          body: "Fusce sodales, nibh at fringilla imperdiet, felis est malesuada neque, vitae elementum.",
          votes: 0,
          author: "dav3rid",
          review_id: 4,
          created_at: expect.any(String),
        });
      });
  });
  test("ERROR 400: Responds with a 400 error when passed a body with malformed/missing fields", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/4/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing or invalid input to body");
      });
  });
  test("ERROR 400: Responds with a 400 error when passed a user that does not exist", () => {
    const newComment = { username: "turnip", body: "102354684654" };
    return request(app)
      .post("/api/reviews/10/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid user or review id does not exist");
      });
  });
  test("ERROR 400: Responds with a 400 error when passed a body with missing fields", () => {
    const newComment = { username: "dav3rid" };
    return request(app)
      .post("/api/reviews/10/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing or invalid input to body");
      });
  });
  test("ERROR 400: Responds with a 404 error when passed an invalid id", () => {
    const newComment = {
      username: "dav3rid",
      body: "Fusce sodales, nibh at fringilla imperdiet, felis est malesuada neque, vitae elementum.",
    };
    return request(app)
      .post("/api/reviews/not_a_number/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("ERROR 404: Responds with a 404 error when passed valid details and id that doesnt exist yet", () => {
    const newComment = {
      username: "dav3rid",
      body: "Fusce sodales, nibh at fringilla imperdiet, felis est malesuada neque, vitae elementum.",
    };
    return request(app)
      .post("/api/reviews/42/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid user or review id does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("This endpoint should delete the specified comment from the database and respond with a 204 No Content status.", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("ERROR 404: When passeed an id that doesnt exist yet", () => {
    return request(app)
      .delete("/api/comments/102")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No comment found at 102");
      });
  });
  test("Error 400: When passed an id in the incorrect format", () => {
    return request(app)
      .delete("/api/comments/not_a_number")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid Input");
      });
  });
});
