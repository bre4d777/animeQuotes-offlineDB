const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const { execSync } = require('child_process');

const GIT_USER_NAME = "bre4d777";
const GIT_USER_EMAIL = "priyanshu001595.kvsrodelhi@gmail.com";

const MAIN_JSON_FILE = 'main_quotes.json';
const STATS_FILE = 'stats.json';
const README_FILE = 'README.md';
const QUOTES_DIR = 'quotes';

// AniList GraphQL API
const ANILIST_API = 'https://graphql.anilist.co';

class AnimeQuotesScraper {
	constructor() {
		this.stats = {
			totalQuotes: 0,
			totalAnime: 0,
			totalCharacters: 0,
			lastUpdated: new Date().toISOString()
		};
		this.processedAnime = new Set();
		this.quoteIdCounter = 1;
	}

	generateUniqueId() {
		return `quote_${this.quoteIdCounter++}_${Date.now()}`;
	}

	async init() {
		// Setup Git config
		try {
			execSync(`git config user.name "${GIT_USER_NAME}"`);
			execSync(`git config user.email "${GIT_USER_EMAIL}"`);
		} catch (error) {
			console.log('Git config setup failed, continuing...');
		}

		// Create quotes directory if it doesn't exist
		await this.ensureDirectory(QUOTES_DIR);

		// Load existing stats if available
		await this.loadStats();
	}

	async ensureDirectory(dir) {
		try {
			await fs.mkdir(dir, { recursive: true });
		} catch (error) {
			if (error.code !== 'EEXIST') throw error;
		}
	}

	async loadStats() {
		try {
			const statsData = await fs.readFile(STATS_FILE, 'utf8');
			this.stats = JSON.parse(statsData);
			console.log('✅ Loaded existing stats');
		} catch (error) {
			console.log('📊 Creating new stats file');
			await this.saveStats();
		}
	}

	async saveStats() {
		await fs.writeFile(STATS_FILE, JSON.stringify(this.stats, null, 2));
	}

	async fetchMainQuotes() {
		try {
			// Check if main JSON already exists
			try {
				await fs.access(MAIN_JSON_FILE);
				console.log('📁 Main quotes file already exists, loading...');
				const data = await fs.readFile(MAIN_JSON_FILE, 'utf8');
				return JSON.parse(data);
			} catch (error) {
				console.log('🌐 Fetching quotes from API...');
			}

			const response = await axios.get('https://yurippe.vercel.app/api/quotes');
			const quotes = response.data;

			await fs.writeFile(MAIN_JSON_FILE, JSON.stringify(quotes, null, 2));
			console.log(`✅ Downloaded ${quotes.length} quotes`);

			return quotes;
		} catch (error) {
			console.error('❌ Failed to fetch quotes:', error.message);
			throw error;
		}
	}

	async searchAnimeOnAniList(animeName) {
		const query = `
			query ($search: String) {
				Media (search: $search, type: ANIME) {
					id
					title {
						romaji
						english
						native
					}
				}
			}
		`;

		try {
			const response = await axios.post(ANILIST_API, {
				query,
				variables: { search: animeName }
			});

			if (response.data.data && response.data.data.Media) {
				return response.data.data.Media;
			}
			return null;
		} catch (error) {
			console.error(`❌ AniList search failed for "${animeName}":`, error.message);
			return null;
		}
	}

	async processQuotesByAnime(quotes) {
		// Group quotes by show (anime)
		const animeGroups = {};

		for (const quote of quotes) {
			const animeName = quote.show;
			if (!animeGroups[animeName]) {
				animeGroups[animeName] = [];
			}
			animeGroups[animeName].push(quote);
		}

		console.log(`📚 Found ${Object.keys(animeGroups).length} unique anime`);

		// Process each anime
		for (const [animeName, animeQuotes] of Object.entries(animeGroups)) {
			await this.processAnime(animeName, animeQuotes, quotes);
		}
	}

	async processAnime(animeName, animeQuotes, allQuotes) {
		console.log(`\n🎌 Processing: ${animeName} (${animeQuotes.length} quotes)`);

		// Search for anime on AniList
		const animeData = await this.searchAnimeOnAniList(animeName);

		let fileName;
		let anilistId = null;

		if (animeData && animeData.id) {
			fileName = `${animeData.id}.json`;
			anilistId = animeData.id;
			console.log(`✅ Found AniList ID: ${animeData.id}`);
		} else {
			// Fallback to sanitized anime name
			fileName = `${animeName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.json`;
			console.log(`⚠️ AniList ID not found, using filename: ${fileName}`);
		}

		const filePath = path.join(QUOTES_DIR, fileName);

		// Load existing quotes for this anime if file exists
		let existingQuotes = [];
		let existingQuoteTexts = new Set();

		try {
			const existingData = await fs.readFile(filePath, 'utf8');
			const existingFile = JSON.parse(existingData);
			existingQuotes = existingFile.quotes || [];
			existingQuoteTexts = new Set(existingQuotes.map(q => q.quote));
		} catch (error) {
			// File doesn't exist, start fresh
		}

		// Process and format new quotes
		const newQuotes = [];
		let newQuotesCount = 0;

		for (const quote of animeQuotes) {
			if (!existingQuoteTexts.has(quote.quote)) {
				const formattedQuote = {
					id: this.generateUniqueId(),
					character: quote.character,
					show: quote.show,
					quote: quote.quote
				};
				newQuotes.push(formattedQuote);
				newQuotesCount++;
			}
		}

		// Combine all quotes
		const allQuotesForAnime = [...existingQuotes, ...newQuotes];

		// Count unique characters
		const characters = new Set(allQuotesForAnime.map(q => q.character));

		// Create anime file structure
		const animeFileData = {
			name: animeName,
			anilistId: anilistId,
			totalQuotes: allQuotesForAnime.length,
			totalCharacters: characters.size,
			quotes: allQuotesForAnime
		};

		await fs.writeFile(filePath, JSON.stringify(animeFileData, null, 2));
		console.log(`💾 Saved ${allQuotesForAnime.length} quotes (${newQuotesCount} new)`);

		// Remove processed quotes from main array
		for (let i = allQuotes.length - 1; i >= 0; i--) {
			if (allQuotes[i].show === animeName) {
				allQuotes.splice(i, 1);
			}
		}

		// Update stats
		this.stats.totalQuotes += newQuotesCount;

		if (!this.processedAnime.has(animeName)) {
			this.stats.totalAnime++;
			this.processedAnime.add(animeName);
		}

		// Update character count (recalculate from all processed anime)
		await this.recalculateStats();

		this.stats.lastUpdated = new Date().toISOString();
		await this.saveStats();
		await this.updateReadme();

		// Git commit for this anime
		try {
			execSync('git add .');
			execSync(`git commit -m "Add quotes for ${animeName} (${newQuotesCount} new quotes)"`);
			execSync('git push');
			console.log('✅ Git commit and push successful');
		} catch (error) {
			console.log('⚠️ Git operations failed:', error.message);
		}

		// Small delay to avoid rate limiting
		await new Promise(resolve => setTimeout(resolve, 1000));
	}

	async recalculateStats() {
		try {
			const files = await fs.readdir(QUOTES_DIR);
			let totalQuotes = 0;
			let totalCharacters = 0;

			for (const file of files) {
				if (file.endsWith('.json')) {
					const filePath = path.join(QUOTES_DIR, file);
					const data = await fs.readFile(filePath, 'utf8');
					const animeData = JSON.parse(data);

					totalQuotes += animeData.totalQuotes || 0;
					totalCharacters += animeData.totalCharacters || 0;
				}
			}

			this.stats.totalQuotes = totalQuotes;
			this.stats.totalCharacters = totalCharacters;
			this.stats.totalAnime = files.filter(f => f.endsWith('.json')).length;
		} catch (error) {
			console.log('⚠️ Failed to recalculate stats:', error.message);
		}
	}

	async updateReadme() {
		const readmeContent = `# Anime Quotes Collection

An organized collection of anime quotes, automatically scraped and categorized by anime series.

## 📊 Statistics

- **Total Quotes**: ${this.stats.totalQuotes.toLocaleString()}
- **Total Anime**: ${this.stats.totalAnime.toLocaleString()}
- **Total Characters**: ${this.stats.totalCharacters.toLocaleString()}
- **Last Updated**: ${new Date(this.stats.lastUpdated).toLocaleDateString()}

## 🗂️ Structure

Quotes are organized in the \`quotes/\` directory, with each anime having its own JSON file named by AniList ID (when available) or sanitized anime name.

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
`;

		await fs.writeFile(README_FILE, readmeContent);
	}

	async updateMainJsonFile(quotes) {
		await fs.writeFile(MAIN_JSON_FILE, JSON.stringify(quotes, null, 2));
	}

	async run() {
		try {
			console.log('🚀 Starting Anime Quotes Scraper...');

			await this.init();

			const quotes = await this.fetchMainQuotes();
			console.log(`📋 Processing ${quotes.length} total quotes`);

			await this.processQuotesByAnime(quotes);

			// Update main JSON with remaining quotes (should be empty now)
			await this.updateMainJsonFile(quotes);

			console.log('\n🎉 Scraping completed successfully!');
			console.log(`📊 Final Stats:`, this.stats);

		} catch (error) {
			console.error('💥 Scraper failed:', error);
			process.exit(1);
		}
	}
}

// Run the scraper
if (require.main === module) {
	const scraper = new AnimeQuotesScraper();
	scraper.run();
}

module.exports = AnimeQuotesScraper;