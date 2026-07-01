import fs from 'node:fs/promises';
import path from 'node:path';
import { parseCsv, rowsToObjects } from './loadPublicCsv';

const dataDir = 'data/private/book-bans/normalized';
const coverDir = 'public/drafts/book-bans/covers';
const publicCoverPath = '/drafts/book-bans/covers';

async function loadPrivateCsv(filename) {
	const filePath = path.join(process.cwd(), dataDir, filename);
	const text = await fs.readFile(filePath, 'utf8');
	return rowsToObjects(parseCsv(text));
}

export async function loadBookBanData() {
	const [books, events, coverFiles] = await Promise.all([
		loadPrivateCsv('books.csv'),
		loadPrivateCsv('ban-events.csv'),
		fs.readdir(path.join(process.cwd(), coverDir)).catch(() => []),
	]);
	const availableCovers = new Set(coverFiles);

	return {
		eventCount: events.length,
		books: books.map((book) => {
			const localSmallFile = book.custom_cover_file || `${book.cover_id}-S.jpg`;
			const localLargeFile = book.custom_cover_file || `${book.cover_id}-L.jpg`;

			return {
				...book,
				ban_count: Number(book.ban_count),
				local_cover_url_small: availableCovers.has(localSmallFile)
					? `${publicCoverPath}/${localSmallFile}`
					: '',
				local_cover_url_large: availableCovers.has(localLargeFile)
					? `${publicCoverPath}/${localLargeFile}`
					: '',
			};
		}),
	};
}
