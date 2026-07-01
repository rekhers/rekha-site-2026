'use client';

import { Topper } from './topper';
import { BookScrolly } from './bookScrolly';

export default function Story({ books, eventCount }) {
	return (
		<main
			style={{
				backgroundAttachment: 'fixed',
				backgroundColor: '#f7f1ec',
				backgroundImage:
					'url(/drafts/book-bans/crumpled-paper-topper.png)',
				backgroundPosition: 'center',
				backgroundSize: 'cover',
			}}
		>
			<Topper />
			<BookScrolly books={books} eventCount={eventCount} />
		</main>
	);
}
