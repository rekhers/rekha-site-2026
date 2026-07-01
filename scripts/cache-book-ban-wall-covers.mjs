import fs from 'node:fs/promises';
import path from 'node:path';
import { parseCsv, rowsToObjects } from '../src/utils/loadPublicCsv.js';

const coverCount = 320;
const projectRoot = process.cwd();
const booksPath = path.join(
	projectRoot,
	'data/private/book-bans/normalized/books.csv'
);
const coverDir = path.join(projectRoot, 'public/drafts/book-bans/covers');

function hasCover(book) {
	return Boolean(
		book.cover_url_small ||
			book.cover_url_medium ||
			book.cover_url_large ||
			book.custom_cover_file
	);
}

function bookKey(book) {
	return `${book.book_id}|${book.title}`;
}

function isCanonBook(book) {
	return book.school_years.split('|').filter(Boolean).length === 4;
}

const books = rowsToObjects(parseCsv(await fs.readFile(booksPath, 'utf8')));
const booksWithCovers = books.filter(hasCover);
const canon = booksWithCovers.filter(isCanonBook);
const esperanza = booksWithCovers.find(
	(book) => book.title.toLowerCase() === 'esperanza rising'
);
const selectedKeys = new Set(canon.map(bookKey));
if (esperanza) selectedKeys.add(bookKey(esperanza));

for (const book of booksWithCovers) {
	if (selectedKeys.size >= coverCount) break;
	selectedKeys.add(bookKey(book));
}

const selectedBooks = booksWithCovers
	.filter((book) => selectedKeys.has(bookKey(book)))
	.slice(0, coverCount);

await fs.mkdir(coverDir, { recursive: true });

let nextIndex = 0;
let downloaded = 0;
let skipped = 0;
let failed = 0;

async function worker() {
	while (nextIndex < selectedBooks.length) {
		const book = selectedBooks[nextIndex];
		nextIndex += 1;

		if (book.custom_cover_file || !book.cover_id) {
			skipped += 1;
			continue;
		}

		const filename = `${book.cover_id}-S.jpg`;
		const destination = path.join(coverDir, filename);
		try {
			await fs.access(destination);
			skipped += 1;
			continue;
		} catch {
			// Download the missing thumbnail below.
		}

		const source =
			book.cover_url_small || book.cover_url_medium || book.cover_url_large;
		try {
			const response = await fetch(source);
			if (!response.ok) throw new Error(`HTTP ${response.status}`);
			const bytes = Buffer.from(await response.arrayBuffer());
			await fs.writeFile(destination, bytes);
			downloaded += 1;
		} catch (error) {
			failed += 1;
			console.warn(`Could not cache ${book.title}: ${error.message}`);
		}
	}
}

await Promise.all(Array.from({ length: 12 }, () => worker()));
console.log(
	`Wall covers: ${downloaded} downloaded, ${skipped} already local, ${failed} failed.`
);
