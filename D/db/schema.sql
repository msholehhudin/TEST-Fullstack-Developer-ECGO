create extension if not exists "pgcrypto";

create table branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table cabinets (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  branch_id uuid not null references branches(id),
  status text not null check (
    status in ('ONLINE', 'OFFLINE', 'MAINTENANCE')
  ),
  last_heartbeat_at timestamptz,
  created_at timestamptz not null default now()
);

create table slots (
  id uuid primary key default gen_random_uuid(),
  cabinet_id uuid not null references cabinets(id) on delete cascade,
  slot_number int not null check (slot_number between 1 and 12),
  state text not null check (
    state in ('EMPTY', 'CHARGING', 'FULL', 'LOCKED', 'FAULT')
  ),
  soc_percent int,
  updated_at timestamptz not null default now(),

  unique (cabinet_id, slot_number),

  check (
    (state = 'EMPTY' and soc_percent is null)
    or
    (state <> 'EMPTY' and soc_percent between 0 and 100)
  )
);

create table swap_transactions (
  id uuid primary key default gen_random_uuid(),
  cabinet_id uuid not null references cabinets(id) on delete cascade,
  slot_id uuid references slots(id) on delete set null,
  swapped_at timestamptz not null,
  battery_out_soc int,
  battery_in_soc int,
  created_at timestamptz not null default now()
);

create index idx_cabinets_branch_id
  on cabinets(branch_id);

create index idx_cabinets_status
  on cabinets(status);

create index idx_slots_cabinet_id
  on slots(cabinet_id);

create index idx_swap_transactions_cabinet_swapped_at
  on swap_transactions(cabinet_id, swapped_at desc);

create index idx_swap_transactions_swapped_at
  on swap_transactions(swapped_at desc);