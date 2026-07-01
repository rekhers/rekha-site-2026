import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const dataRoot = path.join(projectRoot, 'data/private/book-bans');
const normalizedDir = path.join(dataRoot, 'normalized');

const sources = [
	{
		schoolYear: '2021-2022',
		file: path.join(dataRoot, 'raw/2021-2022.csv'),
		statusFields: ['Type of Ban'],
		dateFields: ['Date of Challenge/Removal'],
		actionFields: ['Origin of Challenge'],
	},
	{
		schoolYear: '2022-2023',
		file: path.join(dataRoot, 'raw/2022-2023.csv'),
		statusFields: ['Ban Status'],
		dateFields: ['Date of Challenge/Removal'],
		actionFields: ['Origin of Challenge'],
	},
	{
		schoolYear: '2023-2024',
		file: path.join(dataRoot, 'raw/2023-2024.csv'),
		statusFields: ['Ban Status'],
		dateFields: ['Challenge/Removal'],
		actionFields: ['Initiating Action'],
	},
	{
		schoolYear: '2024-2025',
		file: path.join(dataRoot, 'enrichment/2024-2025-with-covers.csv'),
		statusFields: ['Ban Status'],
		dateFields: ['Date of Challenge/Removal'],
		actionFields: ['Origin of Challenge', 'Initiating Action'],
	},
];

const bookHeaders = [
	'book_id',
	'title',
	'author',
	'secondary_authors',
	'illustrators',
	'translators',
	'series',
	'openlibrary_work_key',
	'cover_id',
	'cover_url_small',
	'cover_url_medium',
	'cover_url_large',
	'matched_title',
	'matched_authors',
	'custom_cover_file',
	'ban_count',
	'school_years',
];

const eventHeaders = [
	'event_id',
	'book_id',
	'school_year',
	'state',
	'district',
	'challenge_date',
	'ban_status',
	'initiating_action',
	'source_file',
	'source_row',
];

function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const char = text[index];
		const nextChar = text[index + 1];

		if (char === '"' && inQuotes && nextChar === '"') {
			field += '"';
			index += 1;
			continue;
		}

		if (char === '"') {
			inQuotes = !inQuotes;
			continue;
		}

		if (char === ',' && !inQuotes) {
			row.push(field);
			field = '';
			continue;
		}

		if ((char === '\n' || char === '\r') && !inQuotes) {
			if (char === '\r' && nextChar === '\n') {
				index += 1;
			}

			row.push(field);
			if (row.some((value) => value.length > 0)) {
				rows.push(row);
			}
			row = [];
			field = '';
			continue;
		}

		field += char;
	}

	if (field || row.length > 0) {
		row.push(field);
		rows.push(row);
	}

	return rows;
}

function rowsToObjects(rows) {
	const [rawHeaders, ...values] = rows;
	const headers = rawHeaders.map((header) => header.replace(/^\uFEFF/, '').trim());

	return values.map((row) =>
		Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']))
	);
}

function firstValue(row, fields) {
	for (const field of fields) {
		const value = row[field]?.trim();
		if (value) return value;
	}
	return '';
}

function normalizeText(value) {
	return value
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

function canonicalBookKey(title, author) {
	return `${normalizeText(title)}|${normalizeText(author)}`;
}

function makeBookId(row, canonicalKey) {
	const workKey = row.openlibrary_work_key?.trim();
	if (workKey) return `ol-${workKey.replace(/^\/works\//, '').toLowerCase()}`;
	return `book-${createHash('sha1').update(canonicalKey).digest('hex').slice(0, 12)}`;
}

function makeEventId(parts) {
	return `event-${createHash('sha1').update(parts.join('|')).digest('hex').slice(0, 16)}`;
}

function csvValue(value) {
	const text = String(value ?? '');
	return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, headers) {
	return [
		headers.join(','),
		...rows.map((row) => headers.map((header) => csvValue(row[header])).join(',')),
	].join('\n');
}

const booksByCanonicalKey = new Map();
const events = [];

for (const source of sources) {
	const text = await fs.readFile(source.file, 'utf8');
	const sourceRows = rowsToObjects(parseCsv(text));
	const sourceFile = path.relative(projectRoot, source.file);

	for (const [index, row] of sourceRows.entries()) {
		const title = firstValue(row, ['Title']);
		const author = firstValue(row, ['Author']);
		if (!title) continue;

		const canonicalKey = canonicalBookKey(title, author);
		let book = booksByCanonicalKey.get(canonicalKey);

		if (!book) {
			book = {
				book_id: makeBookId(row, canonicalKey),
				title,
				author,
				secondary_authors: firstValue(row, ['Secondary Author(s)']),
				illustrators: firstValue(row, ['Illustrator(s)']),
				translators: firstValue(row, ['Translator(s)']),
				series: firstValue(row, ['Series', 'Series Name']),
				openlibrary_work_key: firstValue(row, ['openlibrary_work_key']),
				cover_id: firstValue(row, ['cover_id']),
				cover_url_small: firstValue(row, ['cover_url_small']),
				cover_url_medium: firstValue(row, ['cover_url_medium']),
				cover_url_large: firstValue(row, ['cover_url_large']),
				matched_title: firstValue(row, ['matched_title']),
				matched_authors: firstValue(row, ['matched_authors']),
				custom_cover_file: normalizeText(title) === 'esperanza rising' ? 'esperanza-rising.jpg' : '',
				ban_count: 0,
				school_years: new Set(),
			};
			booksByCanonicalKey.set(canonicalKey, book);
		} else {
			for (const field of [
				'openlibrary_work_key',
				'cover_id',
				'cover_url_small',
				'cover_url_medium',
				'cover_url_large',
				'matched_title',
				'matched_authors',
			]) {
				if (!book[field] && row[field]?.trim()) book[field] = row[field].trim();
			}
		}

		book.ban_count += 1;
		book.school_years.add(source.schoolYear);

		const state = firstValue(row, ['State']);
		const district = firstValue(row, ['District']);
		const challengeDate = firstValue(row, source.dateFields);
		const banStatus = firstValue(row, source.statusFields);
		const initiatingAction = firstValue(row, source.actionFields);

		events.push({
			event_id: makeEventId([
				source.schoolYear,
				book.book_id,
				state,
				district,
				challengeDate,
				banStatus,
				String(index + 2),
			]),
			book_id: book.book_id,
			school_year: source.schoolYear,
			state,
			district,
			challenge_date: challengeDate,
			ban_status: banStatus,
			initiating_action: initiatingAction,
			source_file: sourceFile,
			source_row: index + 2,
		});
	}
}

const books = [...booksByCanonicalKey.values()]
	.map((book) => ({
		...book,
		school_years: [...book.school_years].sort().join('|'),
	}))
	.sort((left, right) => right.ban_count - left.ban_count || left.title.localeCompare(right.title));

await fs.mkdir(normalizedDir, { recursive: true });
await fs.writeFile(path.join(normalizedDir, 'books.csv'), `${toCsv(books, bookHeaders)}\n`);
await fs.writeFile(path.join(normalizedDir, 'ban-events.csv'), `${toCsv(events, eventHeaders)}\n`);

const esperanza = books.find((book) => normalizeText(book.title) === 'esperanza rising');
console.log(`Normalized ${events.length.toLocaleString()} ban events into ${books.length.toLocaleString()} books.`);
console.log(
	esperanza
		? `Esperanza Rising: ${esperanza.ban_count} event(s), ${esperanza.school_years}.`
		: 'Esperanza Rising was not found.'
);
