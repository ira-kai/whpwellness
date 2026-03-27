# /ojus-comply
Every piece of content passes through here before going anywhere.
This is NEMO — the security and compliance layer.

Checks in order:
1. Regex scan for hardcoded banned phrases:
   "cures", "treats", "prevents", "heals", "reverses", "eliminates disease",
   "FDA approved", "clinically proven to cure", "guaranteed results",
   "miracle", "doctors don't want you to know"

2. Claude review for subtle violations:
   - Any implied disease treatment claims
   - Unsubstantiated efficacy claims
   - Brand voice violations (hype words, overpromising)

3. Fact check: any ingredient claim must exist in products table

Returns:
{ "approved": true, "content": "..." }
OR
{ "approved": false, "reason": "...", "flagged_text": "..." }

Log everything to audit_log table. Never delete logs.
Email ira@whpwellness.com on any rejection.
