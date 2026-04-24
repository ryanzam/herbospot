# 🌿 HerboSpot

> **Your trusted source for high-quality herbs, spices, and natural wellness solutions.**

HerboSpot is a full-stack e-commerce web application built with **Next.js 19.2**, **Prisma**, **BetterAuth**, **MongoDB** and **Cloudinary**. It allows users to browse and purchase organic herbs, spices, and aromatic products through a clean, modern storefront with secure authentication and order management.

🌐 **Live:** [herbospot.vercel.app](https://herbospot.vercel.app)

---

## ✨ Features

- **Product Catalog** — Browse herbs, spices, and aromatics with rich product listings
- **User Authentication** — Secure sign-up/sign-in powered by BetterAuth
- **Order Management** — Track and manage customer orders
- **Payment Gateway** — 3rd party payment gateway
- **Image Uploads** — Product images hosted via Cloudinary CDN
- **Smooth Animations** — UI transitions powered by Framer Motion
- **Responsive Design** — Fully mobile-friendly with Tailwind CSS v4
- **Type-Safe Codebase** — Written entirely in TypeScript

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Database ORM | Prisma 6 |
| Authentication | BetterAuth 1.5 |
| Image Storage | Cloudinary |
| Animations | Framer Motion |
| Icons | React Icons |
| Notifications | React Hot Toast |
| Deployment | Vercel |

---

## 📁 Project Structure

```
herbospot/
├── app/                    # Next.js App Router — pages, layouts, API routes
├── components/             # Reusable React UI components
├── contexts/               # React context providers (e.g., auth, cart)
├── interfaces/             # TypeScript interfaces and type definitions
├── lib/                    # Utility functions, db client, auth helpers
├── prisma/                 # Prisma schema and database migrations
│   └── schema.prisma
├── public/                 # Static assets (images, icons)
├── types/                  # Global TypeScript type declarations
├── next.config.ts          # Next.js configuration
├── prisma.config.ts        # Prisma configuration
├── tailwind.config.*       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript compiler options
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or higher
- **npm**, **yarn**, **pnpm**, or **bun**
- A **PostgreSQL** (or compatible) database
- A **Cloudinary** account for image hosting

### 1. Clone the Repository

```bash
git clone https://github.com/ryanzam/herbospot.git
cd herbospot
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root and populate the following variables:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# BetterAuth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Set Up the Database

Run Prisma migrations to initialize the database schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint on the codebase |

---

## 🗄️ Database

HerboSpot uses **Prisma ORM** with the `@better-auth/prisma-adapter` for seamless authentication integration. The schema is defined in `prisma/schema.prisma`.

To explore your database interactively:

```bash
npx prisma studio
```

---

## ☁️ Deployment

The easiest way to deploy HerboSpot is via **[Vercel](https://vercel.com)**:

1. Push your repository to GitHub
2. Import the project on [vercel.com/new](https://vercel.com/new)
3. Add all required environment variables in the Vercel dashboard
4. Deploy!

For other platforms, run `npm run build` and serve the `.next` output with `npm run start`.

---

## 📂 Key Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero section and featured categories |
| `(admin)/products` | CRUD functionality of Products for Admin |
| `(admin)/orders` | Update Order and tracking for Admin |
| `(auth)/register` | Secure Sign up for users |
| `(auth)/login` | Login for signedup users |
| `(store)/products` | Full product catalog (herbs, spices, aromatics) |
| `(store)/orders` | Order history and tracking for authenticated users |
| `(store)/cart` | Add items to Cart for checkout |
| `(store)/checkout` | Payment option for authenticated users |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is private. All rights reserved © HerboSpot.

---

## 📬 Contact

**HerboSpot**
📧 info@herbospot.com