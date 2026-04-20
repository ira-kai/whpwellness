#!/usr/bin/env node

/**
 * wix_import.js
 *
 * Reads product JSON files from the local filesystem, matches them to
 * existing Wix Stores V1 products by slug, and PATCHes description,
 * additionalInfoSections, and seoData onto each matched product.
 *
 * Usage:
 *   node wix_import.js                       # dry-run (default)
 *   node wix_import.js --execute             # actually write to Wix
 *   node wix_import.js --single calm         # dry-run one product
 *   node wix_import.js --single calm --execute
 *
 * Environment:
 *   WIX_API_KEY   – API key from Wix dashboard
 *   WIX_SITE_ID   – (optional) Wix site ID, set via --site-id flag or env
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

// ─── Configuration ───────────────────────────────────────────────────────────

const BASE_URL = "https://www.wixapis.com/stores/v1/products";
const RATE_LIMIT_DELAY_MS = 350; // ms between API calls
const QUERY_PAGE_SIZE = 100;

const PRODUCT_JSON_DIRS = [
  resolve("C:/Users/Ira/Desktop/whpwellness/ojus/product_json"),
  resolve("C:/Users/Ira/Desktop/whpwellness/ojus/product_json/unindexed"),
  resolve("C:/Users/Ira/Desktop/whpwellness/ojus/product_json/quicksilver"),
];

const BACKUP_DIR = resolve("C:/Users/Ira/Desktop/whpwellness/ojus/scripts/backups");

// ─── CLI Parsing ─────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {
    execute: false,
    single: null,
    siteId: process.env.WIX_SITE_ID || null,
    apiKey: process.env.WIX_API_KEY || null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--execute":
        flags.execute = true;
        break;
      case "--single":
        flags.single = args[++i];
        break;
      case "--site-id":
        flags.siteId = args[++i];
        break;
      case "--api-key":
        flags.apiKey = args[++i];
        break;
      case "--help":
        printUsage();
        process.exit(0);
    }
  }

  return flags;
}

function printUsage() {
  console.log(`
Usage: node wix_import.js [options]

Options:
  --execute          Actually write changes to Wix (default is dry-run)
  --single <slug>    Process only one product by slug
  --api-key <key>    Wix API key (or set WIX_API_KEY env var)
  --site-id <id>     Wix site ID (or set WIX_SITE_ID env var)
  --help             Show this message
`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function headers(apiKey, siteId) {
  const h = {
    Authorization: apiKey,
    "Content-Type": "application/json",
  };
  if (siteId) h["wix-site-id"] = siteId;
  return h;
}

// ─── Load Local JSON Files ──────────────────────────────────────────────────

function loadProductJsons() {
  const products = [];
  for (const dir of PRODUCT_JSON_DIRS) {
    if (!existsSync(dir)) {
      console.warn(`  [warn] directory not found, skipping: ${dir}`);
      continue;
    }
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = readFileSync(join(dir, file), "utf-8");
        const data = JSON.parse(raw);
        products.push({ file: join(dir, file), data });
      } catch (err) {
        console.error(`  [error] failed to parse ${join(dir, file)}: ${err.message}`);
      }
    }
  }
  return products;
}

// ─── Wix API: Query All Products ────────────────────────────────────────────

async function fetchAllWixProducts(apiKey, siteId) {
  const allProducts = [];
  let offset = 0;
  let total = Infinity;

  while (offset < total) {
    const body = {
      query: {
        paging: { limit: QUERY_PAGE_SIZE, offset },
      },
    };

    const res = await fetch(`${BASE_URL}/query`, {
      method: "POST",
      headers: headers(apiKey, siteId),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Query failed (${res.status}): ${text}`);
    }

    const json = await res.json();
    const products = json.products || [];
    total = json.totalResults ?? products.length;
    allProducts.push(...products);
    offset += QUERY_PAGE_SIZE;

    if (products.length < QUERY_PAGE_SIZE) break;
    await sleep(RATE_LIMIT_DELAY_MS);
  }

  return allProducts;
}

// ─── Build Update Payload ───────────────────────────────────────────────────

function buildInfoSection(title, text) {
  if (!text) return null;
  return { title, description: `<p>${escapeHtml(text)}</p>` };
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildBenefitsHtml(bullets) {
  if (!bullets || bullets.length === 0) return null;
  const items = bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("\n");
  return `<ul>\n${items}\n</ul>`;
}

function buildUpdatePayload(localProduct) {
  const d = localProduct;

  // Description as HTML paragraphs
  const descriptionHtml = d.description
    ? d.description
        .split(/\n{2,}/)
        .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
        .join("\n")
    : "";

  // Additional Info Sections
  const additionalInfoSections = [];

  // "What Sets This Apart" — uses formulation_rationale OR why_we_carry_it
  const rationale = d.formulation_rationale || d.why_we_carry_it || null;
  const rationaleSection = buildInfoSection("What Sets This Apart", rationale);
  if (rationaleSection) additionalInfoSections.push(rationaleSection);

  // Benefits
  const benefitsHtml = buildBenefitsHtml(d.benefit_bullets);
  if (benefitsHtml) {
    additionalInfoSections.push({ title: "Benefits", description: benefitsHtml });
  }

  // Simple text sections
  const textSections = [
    ["Who It's For", d.who_its_for],
    ["How to Take", d.how_to_take],
    ["Safety", d.safety_note],
    ["Disclaimer", d.compliance_disclaimer],
  ];
  for (const [title, value] of textSections) {
    const section = buildInfoSection(title, value);
    if (section) additionalInfoSections.push(section);
  }

  // SEO data
  const seoData = {};
  if (d.meta_title) seoData.title = d.meta_title;
  if (d.meta_description) seoData.description = d.meta_description;
  if (d.focus_keyword) {
    seoData.tags = [{ type: "meta", props: { name: "keywords", content: d.focus_keyword } }];
  }

  const product = { description: descriptionHtml, additionalInfoSections };
  if (Object.keys(seoData).length > 0) product.seoData = seoData;

  return { product };
}

// ─── Diff Display ───────────────────────────────────────────────────────────

function showDiff(slug, currentProduct, updatePayload) {
  console.log(`\n${"─".repeat(60)}`);
  console.log(`Product: ${slug}`);
  console.log(`Wix ID:  ${currentProduct.id}`);
  console.log(`${"─".repeat(60)}`);

  const update = updatePayload.product;

  // Description
  const oldDesc = (currentProduct.description || "").substring(0, 120);
  const newDesc = (update.description || "").substring(0, 120);
  console.log(`\n  description:`);
  console.log(`    current: ${oldDesc}${oldDesc.length >= 120 ? "..." : ""}`);
  console.log(`    new:     ${newDesc}${newDesc.length >= 120 ? "..." : ""}`);

  // Additional Info Sections
  const oldSections = (currentProduct.additionalInfoSections || []).map((s) => s.title);
  const newSections = (update.additionalInfoSections || []).map((s) => s.title);
  console.log(`\n  additionalInfoSections:`);
  console.log(`    current titles: [${oldSections.join(", ")}]`);
  console.log(`    new titles:     [${newSections.join(", ")}]`);

  // SEO
  if (update.seoData) {
    const oldSeo = currentProduct.seoData || {};
    console.log(`\n  seoData.title:`);
    console.log(`    current: ${oldSeo.title || "(empty)"}`);
    console.log(`    new:     ${update.seoData.title || "(unchanged)"}`);
    console.log(`  seoData.description:`);
    console.log(`    current: ${(oldSeo.description || "(empty)").substring(0, 100)}`);
    console.log(`    new:     ${(update.seoData.description || "(unchanged)").substring(0, 100)}`);
  }
}

// ─── Backup ─────────────────────────────────────────────────────────────────

function backupProduct(product) {
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const filename = `${product.slug || product.id}_${Date.now()}.json`;
  const filepath = join(BACKUP_DIR, filename);
  writeFileSync(filepath, JSON.stringify(product, null, 2), "utf-8");
  return filepath;
}

// ─── Update Product ─────────────────────────────────────────────────────────

async function updateProduct(productId, payload, apiKey, siteId) {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "PATCH",
    headers: headers(apiKey, siteId),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PATCH failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const flags = parseArgs(process.argv);

  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log(`║  Wix Product Import  ${flags.execute ? "▶ EXECUTE MODE" : "⊘ DRY-RUN MODE"}            ║`);
  console.log("╚══════════════════════════════════════════════════════════╝");

  if (!flags.apiKey) {
    console.error("\n[error] No API key provided.");
    console.error("  Set WIX_API_KEY env var or pass --api-key <key>\n");
    process.exit(1);
  }

  // 1. Load local JSON files
  console.log("\n[1/4] Loading local product JSON files...");
  let localProducts = loadProductJsons();
  console.log(`  Found ${localProducts.length} JSON files.`);

  // Filter to single product if requested
  if (flags.single) {
    localProducts = localProducts.filter((p) => p.data.slug === flags.single);
    if (localProducts.length === 0) {
      console.error(`\n[error] No local JSON found with slug "${flags.single}".`);
      process.exit(1);
    }
    console.log(`  Filtered to single product: ${flags.single}`);
  }

  // 2. Query all Wix products
  console.log("\n[2/4] Querying Wix store for existing products...");
  let wixProducts;
  try {
    wixProducts = await fetchAllWixProducts(flags.apiKey, flags.siteId);
  } catch (err) {
    console.error(`\n[error] Failed to query Wix products: ${err.message}`);
    process.exit(1);
  }
  console.log(`  Found ${wixProducts.length} products in Wix store.`);

  // Build slug→product map
  const wixBySlug = new Map();
  for (const wp of wixProducts) {
    if (wp.slug) wixBySlug.set(wp.slug, wp);
  }

  // 3. Match and process
  console.log("\n[3/4] Matching local files to Wix products...");
  const results = { success: [], skipped: [], failed: [] };

  for (const local of localProducts) {
    const slug = local.data.slug;
    const wixProduct = wixBySlug.get(slug);

    if (!wixProduct) {
      console.log(`  [skip] "${slug}" — no matching product in Wix store`);
      results.skipped.push({ slug, reason: "no match in store" });
      continue;
    }

    const payload = buildUpdatePayload(local.data);
    showDiff(slug, wixProduct, payload);

    if (!flags.execute) {
      results.success.push({ slug, action: "dry-run" });
      continue;
    }

    // Back up current data before overwriting
    const backupPath = backupProduct(wixProduct);
    console.log(`  [backup] saved to ${backupPath}`);

    try {
      await updateProduct(wixProduct.id, payload, flags.apiKey, flags.siteId);
      console.log(`  [ok] "${slug}" updated successfully.`);
      results.success.push({ slug, action: "updated" });
    } catch (err) {
      console.error(`  [fail] "${slug}": ${err.message}`);
      results.failed.push({ slug, error: err.message });
    }

    await sleep(RATE_LIMIT_DELAY_MS);
  }

  // 4. Summary
  console.log("\n[4/4] Summary");
  console.log(`  Processed: ${results.success.length}`);
  console.log(`  Skipped:   ${results.skipped.length}`);
  console.log(`  Failed:    ${results.failed.length}`);

  if (results.skipped.length > 0) {
    console.log("\n  Skipped products (no match in Wix):");
    for (const s of results.skipped) {
      console.log(`    - ${s.slug}`);
    }
  }

  if (results.failed.length > 0) {
    console.log("\n  Failed products:");
    for (const f of results.failed) {
      console.log(`    - ${f.slug}: ${f.error}`);
    }
  }

  if (!flags.execute) {
    console.log("\n  This was a DRY RUN. No changes were written.");
    console.log("  Re-run with --execute to apply changes.\n");
  }
}

main().catch((err) => {
  console.error(`\nUnhandled error: ${err.message}`);
  process.exit(1);
});
