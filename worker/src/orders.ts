/**
 * Order persistence — write a cart payload to D1 and return a
 * short, human-readable order id (CL-YYYYMMDD-NNNNN).
 *
 * The WhatsApp link is still the primary way the customer reaches
 * the shop; this table is for the shop's analytics dashboard and
 * the re-order history feature planned for later.
 */

import type { Env, OrderRequest, OrderResponse } from "./env.js";

const TAX_RATE = 0.04;
const DELIVERY_FEE = 30;

export function computeOrderTotals(items: OrderRequest["items"]) {
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + delivery;
  return { subtotal, tax, delivery, total };
}

function generateOrderId(now = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  // Random 5-digit suffix — good enough for human-friendly ids.
  const suffix = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
  return `CL-${yyyy}${mm}${dd}-${suffix}`;
}

export async function saveOrder(env: Env, req: OrderRequest): Promise<OrderResponse> {
  if (!req.items?.length) {
    throw new Error("Cannot save an order with no items");
  }
  const totals = computeOrderTotals(req.items);
  const orderId = generateOrderId();

  // Insert the order row.
  await env.DB.prepare(
    `INSERT INTO orders (id, customer_name, customer_phone, customer_note, subtotal, tax, delivery, total, status, source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`
  )
    .bind(
      orderId,
      req.customer?.name ?? null,
      req.customer?.phone ?? null,
      req.customer?.note ?? null,
      totals.subtotal,
      totals.tax,
      totals.delivery,
      totals.total,
      req.source ?? "cart"
    )
    .run();

  // Bulk-insert the line items.
  const lineStmt = env.DB.prepare(
    `INSERT INTO order_items (order_id, item_id, name, price, qty, line_total)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  await env.DB.batch(
    req.items.map((it) =>
      lineStmt.bind(orderId, it.id, it.name, it.price, it.qty, it.price * it.qty)
    )
  );

  return {
    orderId,
    total: totals.total,
    whatsappUrl: "", // filled in by the route — it needs CONTACT info
  };
}
