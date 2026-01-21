# Gold Shop Server

A modern backend API for managing a Gold Shop, built with high-performance technologies.

## 🚀 Tech Stack

- **Runtime:** [Bun](https://bun.sh) - Fast all-in-one JavaScript runtime.
- **Framework:** [Hono](https://hono.dev) - Ultrafast web framework for the Edges.
- **ORM:** [Drizzle ORM](https://orm.drizzle.team) - Lightweight and type-safe TypeScript ORM.
- **Database:** PostgreSQL.
- **Authentication:** [Better Auth](https://better-auth.com).
- **Validation:** Zod (via `@hono/zod-openapi`).
- **Documentation:** OpenAPI & [Scalar](https://scalar.com).
- **Logging:** Pino.

## 🛠️ Prerequisites

- [Bun](https://bun.sh) installed.
- PostgreSQL database.

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gold-shop-server
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Environment Setup:**
    Copy `.env.example` to `.env` and configure your database credentials and other secrets.
    ```bash
    cp .env.example .env
    ```

    **Required Environment Variables:**
    - `DATABASE_URL`: Connection string for your PostgreSQL database.
    - `BETTER_AUTH_SECRET`: Secret key for authentication.
    - `LOG_LEVEL`: Logging level (default: info).
    - `PORT`: Server port (default: 3000).

## 🏃‍♂️ Running the App

Start the development server with hot reloading:

```bash
bun run dev
```

The server will start at `http://localhost:3000`.

## 📚 API Documentation

Interactive API documentation (Scalar) is available at:

`http://localhost:3000/reference`

Raw OpenAPI specification:

`http://localhost:3000/doc`

## 🗄️ Database Management

This project uses Drizzle ORM for database management.

- **Generate migrations:**
    ```bash
    bun run db:generate
    ```

- **Run migrations:**
    ```bash
    bun run db:migrate
    ```

- **Open Drizzle Studio (Database GUI):**
    ```bash
    bun run db:studio
    ```

- **Push schema changes directly (prototyping):**
    ```bash
    bun run db:push
    ```

## 🔐 Authentication

Authentication is handled by **Better Auth**.
To generate auth schema helpers:

```bash
bun run auth:generate
```

## 📂 Project Structure

```
src/
├── app.ts            # Application setup
├── index.ts          # Entry point
├── db/               # Database configuration, migrations, and schemas
├── lib/              # Shared utilities (auth, types, constants)
├── middlewares/      # Hono middlewares (e.g., logger)
└── routes/           # API routes (auth, users, branches)
```