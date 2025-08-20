# 🎌 Anime Quotes Collection

An organized collection of anime quotes, automatically scraped and categorized by anime series with AniList integration.

## 📊 Statistics

- **Total Quotes**: 8,892
- **Total Anime Series**: 833
- **Total Characters**: 2,503
- **Last Updated**: 8/20/2025

## 🗂️ Structure

Quotes are organized in the `quotes/` directory, with each anime having its own JSON file:
- Files named by AniList ID when available (e.g., `1535.json`)
- Fallback to sanitized anime names for unmatched series
- Each file contains anime metadata and all quotes from that series

## ✨ Features

- **AniList Integration**: Automatic mapping to AniList anime database
- **Rate Limiting**: Intelligent handling of API rate limits
- **Global Duplicate Detection**: Advanced deduplication across all quotes
- **Batch Processing**: Efficient processing in manageable batches
- **Git Automation**: Automatic commits and version control
- **GitHub Data Source**: Updated to use wolfgunblood/anime-quotes repository

## 🤖 Automation

This repository uses an enhanced scraper that:
1. Fetches quotes from GitHub data source
2. Transforms data format automatically
3. Performs comprehensive duplicate removal
4. Maps anime to AniList IDs with rate limiting
5. Processes in batches for optimal performance
6. Handles API errors and retries gracefully
7. Maintains comprehensive statistics

## 📄 Data Source

Quotes are sourced from: https://github.com/wolfgunblood/anime-quotes

---
*Generated automatically by enhanced anime-quotes-scraper v2.1*
