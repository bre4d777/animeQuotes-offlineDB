# animeQuotes-offlineDB

A community-maintained JSON database of anime quotes, used as the data source for anime quote widgets and APIs.

---

## Repo Structure

```
animeQuotes-offlineDB/
├── quotes/             # per-anime JSON files (named by AniList ID)
├── main.json           # flat array of all quotes — what the API reads
├── stats.json          # aggregate counts
├── anilist_cache.json  # cached AniList metadata
└── README.md
```

---

## `main.json` Schema

The primary data file. A flat JSON array where every entry looks like this:

```json
{
  "id": "quote_223_1755681666566",
  "character": "Spike Spiegel",
  "quote": "I was younger then, I wasn't afraid of anything, I didn't think about dying for a second.",
  "anime": "Cowboy Bebop",
  "anilistId": 1
}
```

| Field | Type | Description |
|---|---|---|
| `id` | string | Unique ID — format `quote_{index}_{timestamp}`. Auto-generated, see below. |
| `character` | string | Name of the character who said the quote |
| `quote` | string | The quote text, plain string, no markdown |
| `anime` | string | Anime title — must match the AniList Romaji title exactly |
| `anilistId` | integer | Numeric AniList ID for the anime |

---

## Contributing

Contributions are welcome — new quotes, new anime, typo fixes, all PRs appreciated.

### 1. Find the AniList ID and title

Go to [anilist.co](https://anilist.co), search for the anime, and get the ID from the URL:

```
https://anilist.co/anime/1/Cowboy-Bebop  →  anilistId: 1
```

Use the **Romaji** title shown on AniList as the `anime` field value.

### 2. Generate the entry ID

The `id` field follows the format `quote_{index}_{timestamp}`:

- `index` — the next available index in `main.json` (current length + 1 for each new entry you add)
- `timestamp` — `Date.now()` in milliseconds at time of creation

Example for a new entry that would be index 500:

```
quote_500_1755681666566
```

Each entry you add gets its own unique `id`. If adding multiple quotes, increment the index for each one.

### 3. Add entries to `main.json`

Append to the array. All five fields are required:

```json
{
  "id": "quote_500_1755681666566",
  "character": "Faye Valentine",
  "quote": "They often say that humans can't live alone. But you can get really used to it.",
  "anime": "Cowboy Bebop",
  "anilistId": 1
}
```

The `anime` string must exactly match the `name` in the corresponding file under `quotes/`.

### 4. Open a PR

Write a brief description of what you added:

> Add 6 quotes from Trigun (anilistId: 6)

---

## Guidelines

**Good quotes**
- Meaningful, memorable, or emotionally resonant lines
- Correctly attributed — make sure it was actually said by that character
- More than ~5 words
- Dialogue lines, not narration, episode titles, or song lyrics

**Avoid**
- Duplicates — search `main.json` for the quote text before adding
- Misattributed or made-up quotes
- HTML, markdown, or escaped characters in the quote text
- Quotes from content not listed on AniList

---

## Projects using this

| Project | Description |
|---|---|
| [anime-readme-quotes](https://github.com/bre4d777/anime-readme-quotes) | Dynamic SVG anime quote cards for GitHub READMEs — deploy to Vercel and embed with a single `![](url)` |

Using this database in your own project? Open a PR to add it to the table above.

---

Built by [bre4d777](https://github.com/bre4d777).
