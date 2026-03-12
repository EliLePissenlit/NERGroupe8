
const request = require("supertest");
const app = require("../server");

describe("Health endpoint", () => {
  it("renvoie OK sur /health", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "OK");
  });
});