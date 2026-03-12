const request = require("supertest");
const { app, loginAsAdmin } = require("./helpers");

describe("Tasks API", () => {
  it("renvoie 401 si pas de token sur GET /api/tasks", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  it("renvoie la liste des tâches sur GET /api/tasks avec token", async () => {
    const token = await loginAsAdmin();

    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("renvoie 400 si le titre est manquant sur POST /api/tasks", async () => {
    const token = await loginAsAdmin();
  
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        // pas de title
        description: "Tâche sans titre",
        priority: "high"
      });
  
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error", "Le titre est requis");
  });
});