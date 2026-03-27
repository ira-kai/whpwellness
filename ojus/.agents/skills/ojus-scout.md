# /ojus-scout
Weekly market intelligence. Maps real search demand to Ojus products.

1. Read all products from database where status='live'
2. For each category fire Tavily search:
   "[category] supplements trending 2025"
3. Fire Brave Search queries on competitors:
   Thorne, Seeking Health, Designs for Health, Ritual, AG1
4. Cross-reference findings against database
5. Score each product: search momentum + competitor gap + bundle potential
6. Update search_momentum_score and bundle_score in products table
7. Write to scout_reports table
8. Output: opportunity_report_{date}.json

Output format:
{
  "top_opportunities": [
    {
      "rank": 1,
      "opportunity": "description",
      "products": ["slugs"],
      "search_keyword": "exact keyword people are searching",
      "monthly_searches": N,
      "competitor_gap": "what they're missing that Ojus has",
      "urgency": "high/medium/low"
    }
  ]
}
