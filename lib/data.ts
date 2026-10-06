import data from './catalogue.json';
export const books = data.books;
export const publishers = data.publishers;
export type Book = typeof books[number];
export function publisherFor(book: Book) { return publishers.find(p => p.id === book.publisher_id)!; }
export function searchBooks(query: string) { const q=query.trim().toLowerCase(); return books.filter(b => [b.title,b.author_name,b.isbn,publisherFor(b).name,b.category,b.description].join(' ').toLowerCase().includes(q)); }
