import { notFound } from 'next/navigation';

// Temporarily disabled until the private book-bans dataset is restored.
// import Story from './story';
// import { loadBookBanData } from '@/utils/loadBookBanData';
// const zoomBookIndex = 3;
// const zoomBookTitle = 'esperanza rising';

export const metadata = {
	title: 'Book Bans Draft',
	robots: {
		index: false,
		follow: false,
	},
};

export default function BookBansDraftPage() {
	notFound();

	/* Restore together with the imports and constants above:
	const { books, eventCount } = await loadBookBanData();
	const zoomBook = books.find(
		(book) => book.title.toLowerCase() === zoomBookTitle
	);
	const orderedBooks = books.filter((book) => book !== zoomBook);
	if (zoomBook) orderedBooks.splice(zoomBookIndex, 0, zoomBook);

	return <Story books={orderedBooks} eventCount={eventCount} />;
	*/
}
