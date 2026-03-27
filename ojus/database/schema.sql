-- SQLite schema for Ojus Growth OS

create table if not exists products (
  id text primary key,
  name text not null,
  slug text unique,
  url text unique,
  price real,
  sale_price real,
  category text,
  subcategory text,
  description text,
  benefits text,                     -- JSON array stored as text
  how_to_take text,
  key_ingredients_text text,
  supplement_facts_image_url text,
  product_image_url text,
  all_image_urls text,               -- JSON array stored as text
  in_stock integer default 1,
  tags text,                         -- JSON array stored as text
  status text default 'live',        -- 'live' | 'pending' | 'discontinued'
  search_momentum_score integer default 0,
  monthly_search_volume integer,
  trending_keywords text,            -- JSON array stored as text
  bundle_score integer default 0,
  extraction_method text,            -- 'vision' | 'html' | 'manual'
  extraction_confidence text,        -- 'high' | 'medium' | 'low'
  last_scraped_at text,
  created_at text default (datetime('now')),
  updated_at text default (datetime('now'))
);

create table if not exists ingredients (
  id text primary key,
  product_id text references products(id) on delete cascade,
  name text not null,
  amount text,
  unit text,
  daily_value_pct text,
  form text,
  is_proprietary_blend integer default 0,
  blend_name text,
  extraction_source text default 'vision',
  created_at text default (datetime('now'))
);

create table if not exists bundles (
  id text primary key,
  name text not null,
  hook text,
  target_persona text,
  search_keyword text,
  search_volume integer,
  products text not null,            -- JSON stored as text
  individual_total real,
  bundle_price real,
  savings real,
  science_rationale text,            -- JSON array stored as text
  competitor_gap text,
  blog_post_draft text,
  image_prompt text,
  status text default 'draft',       -- 'draft' | 'approved' | 'live' | 'rejected'
  approved_by text,
  approved_at text,
  wix_product_id text,
  created_at text default (datetime('now')),
  updated_at text default (datetime('now'))
);

create table if not exists conversion_issues (
  id text primary key,
  product_url text,
  product_name text,
  issue_type text,                   -- 'ux' | 'copy' | 'missing_info' | 'broken'
  severity text,                     -- 'critical' | 'high' | 'medium' | 'low'
  description text,
  screenshot_path text,
  suggested_fix text,
  status text default 'open',
  created_at text default (datetime('now'))
);

create table if not exists scout_reports (
  id text primary key,
  week_of text,
  top_opportunities text,            -- JSON stored as text
  trending_searches text,            -- JSON stored as text
  competitor_activity text,          -- JSON stored as text
  recommended_actions text,          -- JSON array stored as text
  created_at text default (datetime('now'))
);

create index if not exists idx_products_category on products(category);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_bundle_score on products(bundle_score desc);
create index if not exists idx_ingredients_product_id on ingredients(product_id);
create index if not exists idx_bundles_status on bundles(status);
create index if not exists idx_conversion_issues_severity on conversion_issues(severity);
