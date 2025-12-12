# Ecommerce Platform

A modern, full-stack e-commerce platform built with Next.js, Prisma, Tailwind CSS, and PostgreSQL.

## Features

- 🛒 Modern shopping experience with product catalog, cart, and checkout
- 🔒 Authentication and user accounts
- 📦 Product management and categories
- 💳 Secure payments (integrate your provider)
- 📊 Admin dashboard (extendable)
- ⚡ Fast, responsive, and mobile-friendly UI

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ridamdli/proxy-Shop.git
   cd proxy-Shop
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and auth credentials.
4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npx prisma studio` — Open Prisma Studio (DB GUI)

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)

---

> Built with ❤️ by Ridamdli and contributors.
