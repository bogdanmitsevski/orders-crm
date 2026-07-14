# Cherry Test — Order Webhook API

A NestJS application that receives orders from an external system via a
webhook, stores them in MongoDB, and exposes an API for browsing orders and
basic analytics.

## What's inside

- `POST /webhook/order` — receives an order from an external system
  (protected by an `x-webhook-token` header), validates the payload, and
  stores it in MongoDB. Prevents duplicates by `order_id`.
- `GET /orders` — list of all stored orders (protected by Basic Auth).
- `GET /analytics` — basic analytics: order count, total revenue, top-selling
  SKU (protected by Basic Auth).
- Swagger documentation at `/api/docs`.

## Requirements

- Node.js 20+ (tested on v20.14) and npm
- Access to MongoDB (a local instance or MongoDB Atlas)

## Step 1 — Install dependencies

```bash
npm install
```

## Step 2 — Environment variables

You'll receive a ready-made `.env` file separately — place it in the project
root (it's already listed in `.gitignore`, so it won't be committed).

For reference, here's what each variable is used for:

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `LOCAL` or `PROD` (validated with Joi on startup) |
| `ACCESS_SECRET_KEY` | Application secret key |
| `HOST` / `PORT` | Address the server binds to |
| `MONGODB_URL` | MongoDB connection string. If you're using MongoDB Atlas, make sure your IP address is added under **Network Access** on the cluster — otherwise the app won't be able to connect |
| `WEBHOOK_SECRET_TOKEN` | The value the external system must send in the `x-webhook-token` header when calling `POST /webhook/order` |
| `API_BASIC_AUTH_USER` / `API_BASIC_AUTH_PASSWORD` | Basic Auth credentials for `/orders` and `/analytics` |

If any required variable is missing or invalid, the app will fail to start
immediately with a clear error (`EnvVarValidationError`) telling you exactly
which variable is the problem.

## Step 3 — Run the app

```bash
# single run
npm run start

# watch mode (restarts on file changes) — recommended during development
npm run start:dev

# production build + run
npm run build
npm run start:prod
```

On a successful start you'll see:

```
Application is running on: http://127.0.0.1:3000
```

## Step 4 — Swagger (interactive API docs)

Open in your browser:

```
http://localhost:3000/api/docs
```

From there you can browse every route's request/response schema and **run
requests directly from the browser**:

1. Click **Authorize** in the top-right corner.
2. Under `basic`, enter the `API_BASIC_AUTH_USER` / `API_BASIC_AUTH_PASSWORD`
   from your `.env` (required for `GET /orders` and `GET /analytics`).
3. `POST /webhook/order` doesn't use Basic Auth — instead, fill in the
   `x-webhook-token` field shown in that endpoint's "Try it out" form with
   the value of `WEBHOOK_SECRET_TOKEN`.

## Step 5 — Using the API (curl examples)

**Submit an order (webhook):**

```bash
curl -X POST http://localhost:3000/api/webhook/order \
  -H "Content-Type: application/json" \
  -H "x-webhook-token: <your WEBHOOK_SECRET_TOKEN>" \
  -d '{
    "order_id": 1001,
    "customer_email": "john@example.com",
    "total_price": 120.5,
    "currency": "USD",
    "items": [
      { "sku": "TSHIRT-RED", "quantity": 2, "price": 40 },
      { "sku": "CAP-BLACK", "quantity": 1, "price": 40.5 }
    ],
    "created_at": "2026-03-10T18:30:00Z"
  }'
```

- Sending the same `order_id` again returns `409 Conflict`.
- A missing or invalid `x-webhook-token` returns `401 Unauthorized`.
- An invalid payload (e.g. bad email, negative price) returns `400 Bad
  Request` with a description of what failed.

**List orders:**

```bash
curl -u <API_BASIC_AUTH_USER>:<API_BASIC_AUTH_PASSWORD> http://localhost:3000/api/orders
```

**Get analytics:**

```bash
curl -u <API_BASIC_AUTH_USER>:<API_BASIC_AUTH_PASSWORD> http://localhost:3000/api/analytics
```

## Tests

```bash
# unit tests (dependencies are mocked, no real DB needed)
npm run test

# with coverage
npm run test:cov

# e2e tests
npm run test:e2e
```

## Project structure

```
src/
├── common/            # shared config (env validation via Joi), guards
├── modules/
│   ├── orders/        # order domain logic, Mongoose schema, GET /orders
│   ├── webhooks/      # POST /webhook/order, DTO validation, WebhookTokenGuard
│   └── analytics/     # GET /analytics
├── nest/              # bootstrap wiring (Fastify adapter, .env loader)
└── main.ts            # entry point
```
