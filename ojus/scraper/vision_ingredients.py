"""
Claude vision extraction for supplement facts panels.
Sends an image to Claude Haiku and gets back structured ingredient data.
"""

import base64
import json
import os

import anthropic
import httpx


async def extract_ingredients(image_url: str) -> dict:
    """Extract ingredients from a supplement facts panel image via Claude vision."""
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    try:
        image_bytes = httpx.get(image_url, timeout=30).content
    except Exception as e:
        return {"error": f"download_failed: {e}"}

    image_data = base64.standard_b64encode(image_bytes).decode("utf-8")
    media_type = "image/png" if image_url.lower().endswith(".png") else "image/jpeg"

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            messages=[{
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_data,
                        },
                    },
                    {
                        "type": "text",
                        "text": """Extract every ingredient from this supplement
                        facts panel. Return ONLY valid JSON, no other text:
                        {
                          "serving_size": "string",
                          "servings_per_container": "string",
                          "ingredients": [
                            {
                              "name": "ingredient name",
                              "amount": "number as string",
                              "unit": "mg/mcg/IU/g/etc",
                              "daily_value_pct": "percentage or null",
                              "form": "specific form if listed",
                              "is_proprietary_blend": false,
                              "blend_name": null
                            }
                          ],
                          "other_ingredients": "string",
                          "allergen_info": "string",
                          "extraction_confidence": "high/medium/low"
                        }
                        If not a supplement facts panel:
                        {"error": "not_supplement_facts"}""",
                    },
                ],
            }],
        )
    except Exception as e:
        return {"error": f"api_failed: {e}"}

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        return {"error": "parse_failed", "raw": response.content[0].text}
