# ShiftMate

AI-powered staff scheduling platform for restaurants. Manage your team's schedule through natural language chat.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.3+
- [Ollama](https://ollama.com/) (optional, for local AI)

### Setup

```bash
# Install dependencies
bun install

# Copy environment config
cp packages/core-api/.env.example packages/core-api/.env

# Seed the database (creates demo restaurant + 30 workers)
bun run db:seed

# Start the API (port 3001)
bun run dev:core-api

# Start the frontend (port 3000) - in another terminal
bun run dev:core-app
```

Open http://localhost:3000 and login with:
- **Email:** admin@example.com
- **Password:** 123456

### AI Setup

**Option A: Ollama (local, free)**

```bash
ollama pull qwen2.5:7b
ollama serve
```

Set in `.env`:
```
LLM_PROVIDER=ollama
```

**Option B: Claude API**

Set in `.env`:
```
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev:core-api` | Start API server (port 3001) |
| `bun run dev:core-app` | Start frontend (port 3000) |
| `bun run db:seed` | Seed database with demo data |
| `bun run test` | Run all tests |
| `bun run format` | Format code with Prettier |

Custom port: `PORT=3005 bun run dev:core-api`

## Project Structure

```
packages/
  auth/           # Authentication (JWT + bcrypt)
    schema/       # auth_users table
    actions/      # login, logout, register, middleware
  tenant/         # Multi-tenancy
    schema/       # tenants, users tables
    queries/      # CRUD operations
  worker/         # Worker management
    schema/       # workers, availability tables
    queries/      # CRUD + availability
  scheduling/     # Schedule management
    rules/        # Schedule rules (schema + CRUD)
    shifts/       # Shifts (schema + CRUD + auto-fill)
    utils/        # Date and time helpers
  llm/            # LLM abstraction
    providers/    # Ollama + Claude implementations
  database/       # SQLite + Drizzle connection
  core-api/       # Hono REST API
    routes/       # auth, workers, schedule, rules, chat, settings
    tools/        # AI tool definitions + handlers
  core-app/       # React frontend
    components/   # Calendar, Chat, Layout, Workers, Rules
    pages/        # ScheduleBoard, Workers, Rules, Settings, Login, Register
    hooks/        # useSchedule, useChat, useWorkers, useRules
```

## API Endpoints

### Public
- `POST /api/auth/register` - Create account + restaurant
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/health` - Health check

### Protected (requires auth cookie)
- `GET /api/auth/me` - Current user
- `GET /api/workers` - List workers
- `POST /api/workers` - Create worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker
- `GET /api/schedule?week=YYYY-MM-DD` - Get weekly schedule
- `GET /api/schedule-rules` - List rules
- `POST /api/schedule-rules` - Create rule
- `PUT /api/schedule-rules/:id` - Update rule
- `DELETE /api/schedule-rules/:id` - Delete rule
- `POST /api/chat` - Send message to AI
- `GET /api/settings` - Restaurant settings
- `PUT /api/settings` - Update settings

## Testing

```bash
bun run test
```

51 tests covering:
- Date/time utilities (addDays, getDayOfWeek, isWeekend, getShiftDuration, getMondayOfWeek)
- Auto-fill algorithm (availability, max hours, fair distribution, tenant isolation)
- Worker lifecycle (create with availability, cascade delete)
- Hour calculation (multi-shift, cross-tenant isolation)
