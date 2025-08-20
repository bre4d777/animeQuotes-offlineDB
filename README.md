# 🎌 Anime Quotes Collection

An organized collection of anime quotes, automatically scraped and categorized by anime series with AniList integration.

## 📊 Statistics

- **Total Quotes**: 7,540
- **Total Anime Series**: 776
- **Total Characters**: 1,824
- **Last Updated**: 8/20/2025

## 🗂️ Structure

Quotes are organized in the `quotes/` directory, with each anime having its own JSON file:
- Files named by AniList ID when available (e.g., `1535.json`)
- Fallback to sanitized anime names for unmatched series
- Each file contains anime metadata and all quotes from that series

## ✨ Features

- **AniList Integration**: Automatic mapping to AniList anime database
- **Rate Limiting**: Intelligent handling of API rate limits
- **Duplicate Detection**: Automatic cleaning of duplicate quotes
- **Batch Processing**: Efficient processing in manageable batches
- **Git Automation**: Automatic commits and version control

## 🤖 Automation

This repository uses an enhanced scraper that:
1. Fetches quotes from external APIs
2. Cleans duplicates automatically
3. Maps anime to AniList IDs with rate limiting
4. Processes in batches for optimal performance
5. Handles API errors and retries gracefully
6. Maintains comprehensive statistics

---
*Generated automatically by enhanced anime-quotes-scraper v2.0*
