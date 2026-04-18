# Supplement Facts Extraction Task

Your job is to regenerate two CSV files from scratch by reading supplement facts panel images.

## Source folder

`supplement_facts_images/`

Each subfolder is named after the product slug. Inside every subfolder:
- `image_1.png` — product shot. **Ignore this one entirely.**
- `image_2.png` — supplement facts panel
- `image_3.png` — if it exists, it is a **continuation of the same facts panel as image_2**. Read both together as one panel before extracting — do not treat them as separate products or separate panels.

## Output files

Overwrite both files completely — do not append to the existing content.

### supplement_facts.csv

Columns: `slug, ingredient_name, amount, unit, daily_value_pct, form, is_proprietary_blend, blend_name`

Rules:
- One row per ingredient
- `slug` matches the subfolder name exactly
- `amount` is the numeric value only (e.g. `500`, `1.5`, `0.7`) — no units in this field
- `unit` is the unit only (e.g. `mg`, `mcg`, `g`, `mL`, `IU`, `CFU`)
- `daily_value_pct` is the % Daily Value number only, or blank if not listed
- `form` is the specific chemical form if listed in parentheses on the label (e.g. `as Magnesium Glycinate Chelate`), or blank
- `is_proprietary_blend` is `TRUE` or `FALSE`
- `blend_name` is the name of the proprietary blend if the ingredient is part of one, otherwise blank
- If an ingredient's amount is not disclosed because it's inside a proprietary blend, leave `amount` and `unit` blank and set `is_proprietary_blend` to `TRUE`
- Do not include "Other Ingredients" (fillers, capsule material, etc.) — those are not supplement facts

### supplement_instructions.csv

Columns: `slug, serving_size, servings_per_container, directions, warnings`

Rules:
- One row per product
- `serving_size` exactly as written on the label (e.g. `2 Capsules`, `1 Scoop (5.7 Grams)`)
- `servings_per_container` as written (e.g. `30`, `About 14`, `120`)
- `directions` and `warnings` — leave blank, do not guess

## Important

- Read the label exactly as printed. Do not infer, guess, or fill in amounts that aren't visible.
- If an amount is genuinely not readable in the image, leave it blank and note the slug in your response.
- Ingredient names should match the label exactly including any trademark symbols (e.g. `Suntheanine`, `Ferrochel`, `Albion`).
- When finished, report: total row count for each CSV, and any slugs where data was unclear or unreadable.
