import { Hono } from "hono";
import { authenticateToken } from "../middlewares/auth.js";
import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
);

const app = new Hono();

app.get("/:id", async (c) => {
  const publicId = c.req.param("id");

  const {
    results: [product],
  } = await c.env.DB.prepare(
    `
SELECT pv.product_name, pv.barcode, pv.price, pv.created_at, u.username, p.product_id
FROM products p
JOIN product_versions pv ON pv.version_id = p.current_version_id
JOIN users u ON u.user_id = pv.user_id
WHERE public_id = ?
`,
  )
    .bind(publicId)
    .run();

  if (!product) return c.body(null, 404);

  const { results: history } = await c.env.DB.prepare(
    `
    SELECT pv.version_id, pv.product_name, pv.barcode, pv.price, pv.created_at, u.username
    FROM product_versions pv
    JOIN users u ON u.user_id = pv.user_id
    WHERE pv.product_id = ?
    ORDER BY pv.created_at DESC
`,
  )
    .bind(product.product_id)
    .all();

  return c.json({ product, history });
});

app.get("/", async (c) => {
  const { results } = await c.env.DB.prepare(
    `
      SELECT public_id, product_name, barcode, price, username, product_versions.created_at FROM products
      LEFT JOIN product_versions
      ON products.current_version_id = product_versions.version_id
      LEFT JOIN users
      ON product_versions.user_id = users.user_id
    `,
  ).all();

  return c.json(results);
});

app.put("/", authenticateToken, async (c) => {
  const { user_id, username } = c.get("user");
  const { name, barcode, price, publicId } = await c.req.json();

  try {
    var {
      success,
      results: [{ product_id }],
    } = await c.env.DB.prepare("SELECT * FROM products WHERE public_id = ?")
      .bind(publicId)
      .all();
    if (!success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  let versionInsertResult;
  try {
    versionInsertResult = await c.env.DB.prepare(
      "INSERT INTO product_versions (user_id, product_id, product_name, barcode, price) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        user_id,
        product_id,
        name,
        !barcode ? null : barcode,
        !price ? null : price,
      )
      .run();
    if (!versionInsertResult.success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const {
    meta: { last_row_id: versionId },
  } = versionInsertResult;
  try {
    await c.env.DB.prepare(
      "UPDATE products SET current_version_id = ? WHERE product_id = ?",
    )
      .bind(versionId, product_id)
      .run();
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  return c.body(null, 200);
});

app.post("/", authenticateToken, async (c) => {
  const { user_id, username } = c.get("user");
  const { name, barcode, price } = await c.req.json();

  let productInsertResult;
  try {
    productInsertResult = await c.env.DB.prepare(
      "INSERT INTO products (current_version_id, public_id) VALUES (NULL, ?)",
    )
      .bind(nanoid())
      .run();
    if (!productInsertResult.success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const {
    meta: { last_row_id: productId },
  } = productInsertResult;
  let versionInsertResult;
  try {
    versionInsertResult = await c.env.DB.prepare(
      "INSERT INTO product_versions (user_id, product_id, product_name, barcode, price) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        user_id,
        productId,
        name,
        !barcode ? null : barcode,
        !price ? null : price,
      )
      .run();
    if (!versionInsertResult.success) return c.body(null, 500);
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  const {
    meta: { last_row_id: versionId },
  } = versionInsertResult;
  try {
    await c.env.DB.prepare(
      "UPDATE products SET current_version_id = ? WHERE product_id = ?",
    )
      .bind(versionId, productId)
      .run();
  } catch (e) {
    console.error(e);
    return c.body(null, 500);
  }

  return c.body(null, 201);
});

export default app;
