# ECGO Battery Swap Monitoring Dashboard - Muhammad Sholehhudin

A mini internal monitoring dashboard for ECGO's battery swap network.

The application allows the operations team to monitor cabinet status, slot occupancy, recent swap activity, and cabinet-level transaction history.

## Current Status

The core requirements have been implemented and the application has been deployed.

### Completed

- Next.js application setup
- Supabase PostgreSQL connection
- Database schema
- Database seed
- 10 branches seed
- 50 cabinets seed
- 600 cabinet slots seed
- 20,000 swap transaction seed
- Cabinet list page
- Server-side search by cabinet code or branch
- Status filtering
- Sorting by swap count in the last 24 hours
- Offset-based pagination
- Search, filter, sorting, and pagination state persisted in the URL
- Cabinet detail page
- 12-slot cabinet status grid
- Battery SOC display per slot
- 24-hour hourly swap chart
- Last 20 swap transactions
- Loading states
- Empty / not-found states
- Error states with retry
- Responsive UI
- Production deployment on Vercel

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Base UI
- PostgreSQL
- Supabase
- Node.js
- `pg`
- Zod
- Lucide React


## Assumptions & Design Decisions

## Swap Count - Last 24 Hours
swap_24h represents the number of swap transactions within a rolling 24 hours window from the current time

`swap_24h` represents the number of swap transactions within a rolling
24-hour window from the current time.

For example, if the current time is 14:30, the query considers
transactions from 14:30 on the previous day until now.

``sql
swapped_at >= now() - interval '24 hours'


## Pagination

The cabinet list uses offset-based pagination.

Offset pagination was chosen because the application is an internal
operational dashboard with a relatively small dataset and conventional
numbered-page navigation is sufficient for the current requirements.

The main trade-off is that large offsets can become less efficient for
large datasets, and records may shift between pages when the underlying
data changes.

Cursor-based pagination would be a better option for very large or highly
dynamic datasets.


## Database Provider

Supabase is used as the hosted PostgreSQL provider.

The main reason for choosing Supabase is to have a managed PostgreSQL
database that can be easily connected to the Vercel deployment without
having to maintain a separate database server or Docker-based PostgreSQL
instance in production.

The application connects to Supabase using the standard PostgreSQL `pg`
client rather than relying on the Supabase client SDK for database queries.

This keeps the database layer relatively portable and allows the same
application to work with other PostgreSQL providers such as Neon or a
self-hosted PostgreSQL instance.

For local development, the application can use the same PostgreSQL
connection approach through the `DATABASE_URL` environment variable.

## Zero Activity

When a cabinet has no swap transactions within the selected period,
the API returns 0 rather than NULL.

This is handled using COALESCE in the SQL query.


### Not Yet Implemented

- Real-time cabinet detail updates
- Dark mode