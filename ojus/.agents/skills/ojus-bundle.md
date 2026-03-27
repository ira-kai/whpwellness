# /ojus-bundle
Designs bundles that sell. Reads scout output, builds from real data.

1. Read latest scout_reports record
2. Read products where bundle_score > 5 and status='live'
3. Read all ingredients for candidate products
4. For each top 3 opportunities design a bundle:
   - 2-4 products with complementary mechanisms, no duplicate ingredients
   - Combined price under $160
   - Bundle price = individual total x 0.90
   - 3 science bullets: real mechanisms, peer-reviewed basis, FTC-compliant
   - Name using the exact search keyword people are using
   - One-line sales hook
   - Target persona
   - FLUX 1.1 Pro image prompt for blog header
5. Insert 3 records into bundles table as status='draft'
6. Write summary to ira@whpwellness.com

FTC RULES — HARD LIMIT:
NEVER: cures, treats, prevents, heals, reverses disease
ALWAYS: supports, may help, evidence suggests, as part of a comprehensive approach
