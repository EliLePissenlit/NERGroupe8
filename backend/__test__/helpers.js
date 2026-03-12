const request = require("supertest");
const app = require("../server");

async function loginAsAdmin() {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@test.com", password: "password" });

  return res.body.token;
}

module.exports = { app, loginAsAdmin };