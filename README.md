# StyleSync

A design token extraction tool that scrapes any live website and reverse-engineers its design system into editable, exportable tokens.

**Live Demo:** [https://stylesync1.vercel.app](https://stylesync1.vercel.app)

---

## What It Does

Paste any public URL and StyleSync automatically extracts:

- **Colors** — primary, secondary, accent, background, surface, text, border, error, success
- **Typography** — font families, base size, scale ratio, weights, line heights
- **Spacing** — base unit and scale steps
- **Shadows** — sm / md / lg elevation values
- **Border radii** — sm / md / lg / full

Tokens are editable in a live sidebar. A component preview panel re-renders buttons, inputs, cards, and type scale in real time as you make changes. Lock individual tokens to protect them across re-scrapes. Every edit is versioned — browse the full history via the timeline. Export the final token set as CSS custom properties or a Tailwind config.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** Supabase (Postgres)
- **State:** Zustand
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

---

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone https://github.com/Synic-dx/purplemerit-assignment.git
cd purplemerit-assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Find these in your Supabase project under **Settings → API**.

### 4. Set up the database

Run the following SQL in the Supabase SQL editor to create the required tables:

```sql
-- Sites
create table sites (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  domain text,
  extraction_status text default 'pending',
  created_at timestamptz default now()
);

-- Design tokens
create table tokens (
  id uuid primary key default gen_random_uuid(),
  site_id uuid references sites(id) on delete cascade,
  colors jsonb default '{}',
  typography jsonb default '{}',
  spacing jsonb default '{}',
  shadows jsonb default '{}',
  radii jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Token history
create table token_history (
  id uuid primary key default gen_random_uuid(),
  token_id uuid references tokens(id) on delete cascade,
  path text not null,
  old_value text,
  new_value text,
  session_id text,
  created_at timestamptz default now()
);

-- Locks
create table token_locks (
  id uuid primary key default gen_random_uuid(),
  token_id uuid references tokens(id) on delete cascade,
  token_path text not null,
  unique(token_id, token_path)
);
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

The project is deployed on Vercel. To deploy your own instance:

1. Push to a GitHub repository
2. Import the repo in [Vercel](https://vercel.com)
3. Add the three `NEXT_PUBLIC_SUPABASE_*` environment variables in the Vercel project settings
4. Deploy
