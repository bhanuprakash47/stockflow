# StockFlow

StockFlow is a multi-tenant inventory management application for small businesses. It provides organization-scoped authentication, product management, stock adjustments, low-stock monitoring, and configurable inventory thresholds.

## Features

- Create an organization and owner account
- Sign in with JWT-based authentication
- View inventory metrics and low-stock products
- Create, edit, search, and delete products
- Increase or decrease stock quantities
- Configure a default low-stock threshold
- Use organization-specific product and settings data
- Responsive React interface with protected application routes

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, React Router, Vite, Axios, plain CSS |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL with Sequelize |
| Authentication | JSON Web Tokens and bcryptjs |
| Deployment-ready for | Vercel or Netlify frontend; Render backend |

## Project Structure

```text
StockFlow/
├── backend/
│   ├── src/
│   │   ├── config/       # PostgreSQL and Sequelize setup
│   │   ├── controllers/  # Authentication, product, dashboard, settings logic
│   │   ├── middlewares/  # JWT authorization and request errors
│   │   ├── models/       # Organization, User, Product, and Setting models
│   │   ├── routes/       # Express API routes
│   │   ├── app.js        # Express application
│   │   └── server.js     # Database connection and server startup
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios client and API calls
│   │   ├── components/   # Shared, dashboard, and product components
│   │   ├── context/      # Authentication state
│   │   ├── pages/        # Login, registration, dashboard, products, settings
│   │   ├── routes/       # Application route definitions
│   │   └── styles/       # Shared layout and CSS variables
│   ├── .env.example
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A PostgreSQL database, such as Neon or a local PostgreSQL instance

### 1. Clone the repository

```bash
git clone https://github.com/bhanuprakash47/stockflow.git
cd StockFlow
```

### 2. Configure the backend

```bash
cd backend
npm install
cp .env.example .env
```

Set the values in `backend/.env`:

```dotenv
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Start the API:

```bash
npm run dev
```

The backend runs at `http://localhost:5000` by default.

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Set `frontend/.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the application:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Recommended | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | No | Token lifetime; defaults to `7d` |
| `PORT` | No | API port; defaults to `5000` |
| `NODE_ENV` | No | Runtime environment |
| `CLIENT_URL` | Recommended | Allowed frontend origin for CORS |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | Backend API URL; defaults to `http://localhost:5000/api` |

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/register` | Public | Create an organization and owner account |
| `/login` | Public | Sign in |
| `/dashboard` | Protected | Inventory metrics and low-stock alerts |
| `/products` | Protected | Search and manage products |
| `/settings` | Protected | Configure the default low-stock threshold |

## API Overview

Authenticated endpoints require:

```text
Authorization: Bearer <jwt-token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API health |
| `POST` | `/api/auth/register` | Register an organization and user |
| `POST` | `/api/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/dashboard` | Get organization inventory metrics |
| `GET` | `/api/products?search=<term>` | List or search organization products |
| `GET` | `/api/products/:id` | Get single product by ID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/:id` | Update a product |
| `PATCH` | `/api/products/:id/adjust-stock` | Add or deduct stock |
| `DELETE` | `/api/products/:id` | Delete a product |
| `GET` | `/api/settings` | Get organization inventory settings |
| `PUT` | `/api/settings` | Update the default low-stock threshold |

The backend also exposes legacy aliases without the `/api` prefix, such as `/auth`, `/products`, `/dashboard`, and `/settings`.

## Data Model

- **Organization**: A tenant/workspace containing users, products, and settings
- **User**: Belongs to an organization and authenticates with an email and password
- **Product**: Organization-owned inventory item with SKU, pricing, quantity, and threshold
- **Setting**: One organization-level default low-stock threshold

Product SKU values are unique within an organization.

## Development Commands

### Backend

```bash
cd backend
npm run dev     # Start with nodemon
npm start       # Start normally
```

### Frontend

```bash
cd frontend
npm run dev     # Start Vite development server
npm run build   # Create a production build
npm run preview # Preview the production build
npm run lint    # Run ESLint
```

## Deployment

### Backend

1. Deploy the `backend` directory to a Node.js hosting provider.
2. Set `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`, and `PORT` as environment variables.
3. Use `npm start` as the start command.

### Frontend

1. Deploy the `frontend` directory to a static-hosting provider.
2. Set `VITE_API_BASE_URL` to the public backend API URL, including `/api`.
3. Configure the host to rewrite unknown paths to `index.html` for React Router.

Example production API value:

```dotenv
VITE_API_BASE_URL=https://api.example.com/api
```

## Security Notes

- Always set a strong, unique `JWT_SECRET` in production.
- Keep `.env` files out of source control.
- `DATABASE_URL` and JWT values should be stored using the hosting provider's secret-management features.
- API access is scoped to the organization identified by the authenticated JWT.

## License

No license is currently declared for this project.
