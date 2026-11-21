# StockFlow - SaaS Inventory Management System (MVP)

A multi-tenant SaaS inventory management web application built for small sellers and business owners to track inventory, manage products, monitor low-stock items, and maintain tenant-scoped organization data.

---

## 🚀 Finalized Tech Stack

- **Frontend**:
  - React.js (Vite)
  - Plain CSS (Flexbox & CSS Variables)
  - `react-router-dom` (Client-side routing)
  - `axios` (API integration)
- **Backend**:
  - Node.js & Express.js
  - `cors`, `dotenv`
- **ORM & Database**:
  - Sequelize ORM (`sequelize`, `pg`, `pg-hstore`)
  - PostgreSQL (Neon Cloud Database)
- **Authentication & Security**:
  - JWT (`jsonwebtoken`)
  - Password hashing (`bcryptjs`)
- **Deployment Targets**:
  - Backend: Render
  - Frontend: Vercel / Netlify

---

## 📁 Project Architecture & Directory Structure

```text
StockFlow/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/          # Database & environment configurations
│       ├── controllers/     # Route request handlers (auth, products, dashboard, settings)
│       ├── middlewares/     # Authentication, tenant validation & error handling
│       ├── models/          # Sequelize models (User, Organization, Product, Setting)
│       ├── routes/          # Express route definitions
│       ├── utils/           # Helper utilities & JWT generators
│       ├── app.js           # Express app setup & middleware pipeline
│       └── server.js        # Server listener entry point
├── frontend/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── api/             # Axios client & API endpoints
│       ├── components/      # Modular UI components (common, dashboard, products)
│       ├── context/         # AuthContext & global state providers
│       ├── pages/           # Application views (Login, Signup, Dashboard, Products, Settings)
│       ├── routes/          # Client route definitions & protected routes
│       ├── styles/          # Plain CSS stylesheets (Flexbox layouts & themes)
│       ├── App.jsx          # Root component
│       └── main.jsx         # React application entry point
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Neon.tech or local)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Configure `.env`:
   ```bash
   cp .env.example .env
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
