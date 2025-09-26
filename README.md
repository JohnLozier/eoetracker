# EOE Tracker

A health tracking application for Eosinophilic Esophagitis (EoE) patients to monitor symptoms and potential food triggers.

## 🔐 Security Setup (REQUIRED)

Before running this application, you must configure the required environment variables for security and functionality.

### 1. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in all required values in `.env.local`:
   - **CEREBRAS_API_KEY**: Required for AI-powered food analysis
   - **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Required for user authentication  
   - **CLERK_SECRET_KEY**: Required for secure authentication
   - **DATABASE_URL**: Required for data storage
   - **POSTGRES_URL**: Required for database migrations

### 2. API Keys Setup

#### Cerebras AI (Required)
- Sign up at [Cerebras AI](https://cerebras.ai/)
- Generate an API key in your dashboard
- Add to `.env.local` as `CEREBRAS_API_KEY=your_key_here`

#### Clerk Authentication (Required)
- Create account at [Clerk](https://clerk.com/)
- Create a new application
- Copy Publishable Key to `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Copy Secret Key to `CLERK_SECRET_KEY`

#### Database (Required)
- Set up a PostgreSQL database (recommended: [Neon](https://neon.tech/))
- Add connection strings to both `DATABASE_URL` and `POSTGRES_URL`

## 🚀 Development

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 📊 Database

```bash
# Generate migration files
npm run db:generate

# Apply migrations
npm run db:migrate

# Open database studio
npm run db:studio
```

## 🔒 Security Notes

- Never commit `.env.local` or any `.env*` files to version control
- Use different API keys for development and production
- Rotate API keys regularly
- Use `test` keys for development, `live` keys for production
- Keep all sensitive credentials secure

## Features

- Symptom severity tracking
- Food trigger analysis using AI
- Visual analytics and trend tracking
- Secure user authentication
- Data persistence with PostgreSQL

## Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Cerebras Cloud SDK
- **Styling**: Tailwind CSS
- **Charts**: Recharts