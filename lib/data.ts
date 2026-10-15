import data from './catalogue.json';
export const books = data.books;
export const publishers = data.publishers;
export type Book = typeof books[number];
const unknownPublisher = {id:'',slug:'',name:'Publisher not supplied',description:'Publisher information is not visible on the supplied cover.',country:'',city:'',website:'',logo:'',featured:false,status:'active'};
export function publisherFor(book: Book) { return publishers.find(p => p.id === book.publisher_id) ?? unknownPublisher; }
export function searchBooks(query: string) { const q=query.trim().toLowerCase(); return books.filter(b => [b.title,b.subtitle,b.author_name,b.isbn,publisherFor(b).name,b.category,b.description,b.age_range].join(' ').toLowerCase().includes(q)); }
