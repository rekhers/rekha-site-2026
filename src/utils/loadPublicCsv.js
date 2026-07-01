import fs from 'node:fs/promises';
import path from 'node:path';

export function parseCsv(text) {
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

export function rowsToObjects(rows) {
	const [rawHeaders, ...values] = rows;
	const headers = rawHeaders.map((header) => header.replace(/^\uFEFF/, '').trim());

	return values.map((row) =>
		Object.fromEntries(
			headers.map((header, index) => [header, row[index] ?? ''])
		)
	);
}

export async function loadPublicCsv(filename) {
	const filePath = path.join(process.cwd(), 'public', filename);
	const text = await fs.readFile(filePath, 'utf8');
	return rowsToObjects(parseCsv(text));
}
