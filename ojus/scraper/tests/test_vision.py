"""Tests for scraper/vision_ingredients.py — extract_ingredients with mocked API."""

import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch, MagicMock

import pytest

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from vision_ingredients import extract_ingredients


VALID_RESPONSE_JSON = json.dumps({
    "serving_size": "1 capsule",
    "servings_per_container": "60",
    "ingredients": [
        {
            "name": "Zinc",
            "amount": "30",
            "unit": "mg",
            "daily_value_pct": "273%",
            "form": "zinc bisglycinate",
            "is_proprietary_blend": False,
            "blend_name": None,
        }
    ],
    "other_ingredients": "Hypromellose, rice flour",
    "allergen_info": "None",
    "extraction_confidence": "high",
})


def _mock_message(text):
    """Build a mock Anthropic Messages response."""
    content_block = SimpleNamespace(text=text)
    return SimpleNamespace(content=[content_block])


@pytest.mark.asyncio
class TestExtractIngredients:
    @patch("vision_ingredients.httpx")
    @patch("vision_ingredients.anthropic")
    async def test_successful_extraction(self, mock_anthropic, mock_httpx):
        mock_httpx.get.return_value = SimpleNamespace(content=b"fakeimagebytes")
        mock_client = MagicMock()
        mock_client.messages.create.return_value = _mock_message(VALID_RESPONSE_JSON)
        mock_anthropic.Anthropic.return_value = mock_client

        result = await extract_ingredients("https://example.com/facts.jpg")

        assert result["serving_size"] == "1 capsule"
        assert len(result["ingredients"]) == 1
        assert result["ingredients"][0]["name"] == "Zinc"
        assert result["extraction_confidence"] == "high"

    @patch("vision_ingredients.httpx")
    @patch("vision_ingredients.anthropic")
    async def test_invalid_json_response(self, mock_anthropic, mock_httpx):
        mock_httpx.get.return_value = SimpleNamespace(content=b"fakeimagebytes")
        mock_client = MagicMock()
        mock_client.messages.create.return_value = _mock_message("not valid json {{{")
        mock_anthropic.Anthropic.return_value = mock_client

        result = await extract_ingredients("https://example.com/facts.jpg")

        assert result["error"] == "parse_failed"
        assert "not valid json" in result["raw"]

    @patch("vision_ingredients.httpx")
    async def test_download_failure(self, mock_httpx):
        mock_httpx.get.side_effect = ConnectionError("network down")

        result = await extract_ingredients("https://example.com/facts.jpg")

        assert "download_failed" in result["error"]

    @patch("vision_ingredients.httpx")
    @patch("vision_ingredients.anthropic")
    async def test_api_failure(self, mock_anthropic, mock_httpx):
        mock_httpx.get.return_value = SimpleNamespace(content=b"fakeimagebytes")
        mock_client = MagicMock()
        mock_client.messages.create.side_effect = RuntimeError("API rate limit")
        mock_anthropic.Anthropic.return_value = mock_client

        result = await extract_ingredients("https://example.com/facts.jpg")

        assert "api_failed" in result["error"]

    @patch("vision_ingredients.httpx")
    @patch("vision_ingredients.anthropic")
    async def test_not_supplement_facts(self, mock_anthropic, mock_httpx):
        mock_httpx.get.return_value = SimpleNamespace(content=b"fakeimagebytes")
        mock_client = MagicMock()
        mock_client.messages.create.return_value = _mock_message(
            json.dumps({"error": "not_supplement_facts"})
        )
        mock_anthropic.Anthropic.return_value = mock_client

        result = await extract_ingredients("https://example.com/random.jpg")

        assert result["error"] == "not_supplement_facts"

    @patch("vision_ingredients.httpx")
    @patch("vision_ingredients.anthropic")
    async def test_png_media_type(self, mock_anthropic, mock_httpx):
        mock_httpx.get.return_value = SimpleNamespace(content=b"fakepng")
        mock_client = MagicMock()
        mock_client.messages.create.return_value = _mock_message(VALID_RESPONSE_JSON)
        mock_anthropic.Anthropic.return_value = mock_client

        await extract_ingredients("https://example.com/facts.PNG")

        call_args = mock_client.messages.create.call_args
        image_block = call_args.kwargs["messages"][0]["content"][0]
        assert image_block["source"]["media_type"] == "image/png"
