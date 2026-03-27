# /ojus-audit
Browses whpwellness.com with a real browser. Finds why people aren't buying.

For each product URL in database where status='live':
1. Load in persistent Playwright browser
2. Check mobile view first (majority of supplement traffic is mobile)
3. Is Add to Cart visible above the fold?
4. Is price clearly displayed?
5. Is there any social proof?
6. Do images load correctly?
7. Are ingredients accessible?
8. Is there a compelling reason to buy this vs a competitor?
9. Does Add to Cart actually function — click it
10. Screenshot any issue found
11. Write to conversion_issues table with severity

End output: TOP 3 FIXES THAT WILL MOST IMPACT SALES
Order by: critical → high → medium → low
