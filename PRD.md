# PRD - ShiftMate

**AI-Powered Staff Scheduling Platform**

## Overview

ShiftMate is a staff scheduling platform for restaurant managers. The primary interface is a **natural language chat** - the manager describes what they need and the AI executes it. A weekly calendar view shows the results in real time.

The platform is multi-tenant: each restaurant is an isolated workspace with its own workers, schedules, and rules.

## Personas

**Restaurant Manager / Owner**
Creates an account, sets up the restaurant, manages the team and schedules via AI chat. Knows the team and the business needs. Prefers speaking naturally over navigating forms.

**Sub-manager (optional)**
Invited by the owner. Same access to the restaurant workspace.

## Features

### Weekly Calendar View

- Week view as the main screen (Mon-Sun)
- Each column is a day; each card is a shift with name, role, and time
- Color-coded by role: manager (blue), chef (red), cook (orange), waiter (green), dishwasher (gray), host (purple)
- Click a card to see worker details
- Navigate between weeks (previous/next)
- Visual indicator for open shifts (no worker assigned)

### AI Chat

Floating chat bubble available on every screen. The manager types natural language commands:

- "Fill the schedule for next week"
- "Who is available Saturday night?"
- "Swap Maria from Sunday's shift for someone available"
- "How many hours will Ana work this week?"
- "Clear Monday and refill it"

The AI interprets the intent, executes operations via tool calling, and confirms what was done.

### Schedule Rules

Define staffing requirements per day type and time slot:

- Weekday lunch, weekday dinner, weekend lunch, weekend dinner
- Role + count + start/end time
- Rules are used by the auto-fill algorithm

### Auto-fill

Given a period (week or specific day), the system:

1. Loads schedule rules for each day type
2. Checks worker availability
3. Assigns workers respecting: correct role, availability, max weekly hours (40h)
4. Prioritizes workers with fewer hours (fair distribution)
5. Reports unfilled shifts in the chat

### Worker Management

- List all workers with role filtering (tabs)
- Create, edit, and delete workers
- Each worker has: name, role, phone, max hours per week
- Availability per day of week (auto-created on worker creation)

### Restaurant Settings

- Edit restaurant name
- View team overview (worker count by role)

### Authentication & Multi-tenancy

- Register: creates account + restaurant (tenant)
- Login: email + password (JWT in HttpOnly cookie)
- All data isolated by tenant
- 1-2 users per tenant

## AI Tools

The backend exposes these tools for the LLM via function calling:

| Tool | Description |
|------|-------------|
| `list_workers` | List workers, optionally filtered by role |
| `get_schedule` | Get shifts for a specific week |
| `get_schedule_rules` | List configured schedule rules |
| `define_schedule_rule` | Create a schedule rule |
| `auto_fill_schedule` | Fill shifts for a week based on rules |
| `auto_fill_day` | Fill shifts for a specific day |
| `swap_worker` | Replace a worker in a shift |
| `remove_shift` | Remove a specific shift |
| `get_worker_hours` | Get hours scheduled for a worker in a week |
| `clear_schedule` | Clear all shifts for a week |
| `clear_day` | Clear all shifts for a specific day |

## Data Model

```
tenants (id, name, created_at)
users (id, tenant_id, name, email, role, created_at)
auth_users (id, user_id, password, created_at)
workers (id, tenant_id, name, role, phone, max_hours_per_week, created_at)
availability (id, worker_id, day_of_week, available)
schedule_rules (id, tenant_id, name, day_type, role, count, start_time, end_time)
shifts (id, tenant_id, worker_id, date, role, start_time, end_time)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Bun |
| Server | Hono |
| ORM | Drizzle ORM |
| Database | SQLite (bun:sqlite) |
| AI (dev) | Ollama (qwen2.5:7b) |
| AI (prod) | Claude API (claude-sonnet-4-20250514) |
| Frontend | React 19 + Rsbuild |
| Styling | Tailwind CSS 4 + DaisyUI |
| Auth | JWT + bcrypt |

The LLM provider is abstracted via `LLM_PROVIDER` env var - no code changes needed to switch.

## Out of Scope

- Billing / plans
- Granular permissions
- Public API / API keys
- Push notifications
- Mobile app
- PDF/Excel export
