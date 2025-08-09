import { Hono } from "hono";

const products = new Hono();

products.post("/api/products", async (c) => {
  const sleep = (ms) =>
    new Promise((resolve, reject) => setTimeout(resolve, ms));
  await sleep(2000);
  return c.body(null, 204);
});

export default products;
