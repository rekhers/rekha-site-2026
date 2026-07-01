'use client';

import { Topper } from './topper';
import { BookScrolly } from './bookScrolly';

export default function Story({ books, eventCount }) {
	return (
		<main
			style={{
				backgroundColor: '#171716',
			}}
		>
			<Topper />
			<BookScrolly books={books} eventCount={eventCount} />
		</main>
	);
}
