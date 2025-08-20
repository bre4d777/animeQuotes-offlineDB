# Anime Quotes Collection

An organized collection of anime quotes, automatically scraped and categorized by anime series.

## 📊 Statistics

- **Total Quotes**: 3,853
- **Total Anime**: 109
- **Total Characters**: 852
- **Last Updated**: 8/20/2025

## 🗂️ Structure

Quotes are organized in the `quotes/` directory, with each anime having its own JSON file named by AniList ID (when available) or sanitized anime name.

Each anime file contains:
- Anime metadata (name, AniList ID, totals)
- Array of all quotes from that anime
- Character and quote information

## 🤖 Automation

This repository is automatically updated using a scraper that:
1. Fetches quotes from external APIs
2. Organizes them by anime series
3. Maps anime to AniList IDs for consistency
4. Maintains statistics and commits changes

---
*Generated automatically by anime-quotes-scraper*
