# /ojus-measure
Pulls what actually happened. Feeds back into scout to improve weekly.

1. GA4 Reporting API — last 7 days:
   - Sessions by product page
   - Conversion rate by landing page
   - Top traffic sources
2. Wix Stores API — orders last 7 days:
   - Revenue by product
   - Units sold by product
3. Write weekly_kpi to scout_reports

Output: plain text summary email to ira@whpwellness.com
Format: what sold, what didn't, what to push next week
One paragraph. No charts. No dashboards. Just the answer.
