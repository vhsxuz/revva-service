# Revva Services

## Overview

Revva Services is a backend application designed for startups which in a ecosystem, you can sell, view revenue etc, manage employee & stocks.

## Prerequisites

Before running the project, make sure you have the following installed:

* Node.js (v18 or higher)
* npm (v9 or higher)
* Prisma CLI
* PostgreSQL database

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vhsxuz/revva.git
   cd backend_services
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
   ```

## Database Setup

1. Generate Prisma Client:

   ```bash
   npm run db:generate
   ```

2. Run migrations:

   ```bash
   npm run db:migrate
   ```

3. Seed the database:

   ```bash
   npm run db:seed
   ```

## Running the Application

### Development Mode

To start the server with automatic reload on changes:

```bash
npm run dev
```

### Production Mode

To build and run the server:

```bash
npm start
```

## Resetting the Database

If you need to reset the database, use the following command:

```bash
npm run db:reset
```

## Formatting

To format code with Prettier:

```bash
npm run format
```

## License

This project is licensed under the ISC License.
