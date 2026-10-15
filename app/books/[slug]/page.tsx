import {pageMetadata} from '@/lib/metadata';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {books,publisherFor} from '@/lib/data';
import {BookGrid} from '@/components/books';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const book=books.find(b=>b.slug===slug);
  if(!book)notFound();
  return pageMetadata(book.title,'/books/'+slug,book.short_description);
}
export default async function Page({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const book=books.find(b=>b.slug===slug);
  if(!book)notFound();
  const publisher=publisherFor(book);
  const details=[['Age range',book.age_range],['ISBN',book.isbn],['Language',book.language],['Published',book.publication_year],['Pages',book.pages],['Format',book.format],['Publisher',publisher.id?publisher.name:'']].filter(([,value])=>value!==null&&value!=='');
  const related=books.filter(b=>b.id!==book.id&&(b.category===book.category||(book.publisher_id&&b.publisher_id===book.publisher_id))).sort((a,b)=>Number(b.category===book.category)-Number(a.category===book.category)).slice(0,4);
  const schema={'@context':'https://schema.org','@type':'Book',name:book.title,description:book.description,inLanguage:book.language==='Arabic & English'?['ar','en']:'en',...(book.author_name?{author:{'@type':'Person',name:book.author_name}}:{}),...(book.isbn?{isbn:book.isbn}:{}),...(publisher.id?{publisher:{'@type':'Organization',name:publisher.name}}:{})};
  return <section className="wrap section">
    <Link className="text-link" href="/books">← Back to catalogue</Link>
    <div className="book-detail">
      <div className="detail-cover"><img src={book.cover_image} alt={book.title+' book cover'}/></div>
      <div>
        <p className="eyebrow">{book.category}</p>
        <h1 className="page-title">{book.title}</h1>
        {book.subtitle&&<p className="intro" dir="auto">{book.subtitle}</p>}
        {book.author_name&&<p>By <strong>{book.author_name}</strong></p>}
        {publisher.id&&<p><Link href={'/publishers/'+publisher.slug}>{publisher.name}</Link></p>}
        <span className="availability">{book.availability}</span>
        <p className="book-synopsis">{book.description}</p>
        <Link className="button" href={'/contact?book='+book.slug}>Enquire about this book ↗</Link>
        <dl className="metadata-grid">{details.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        {book.cover_highlights.length>0&&<ul>{book.cover_highlights.map(highlight=><li key={highlight}>{highlight}</li>)}</ul>}
        {book.author_name&&book.author_bio&&<div className="detail-about"><p className="eyebrow">ABOUT THE AUTHOR</p><h2>{book.author_name}</h2><p>{book.author_bio}</p></div>}
        <div className="detail-about"><p className="eyebrow">THE PUBLISHER</p><h2>{publisher.name}</h2><p>{publisher.description}</p>{publisher.id&&<Link className="text-link" href={'/publishers/'+publisher.slug}>Meet the publisher →</Link>}</div>
      </div>
    </div>
    <div className="section-heading"><h2>Keep discovering.</h2><Link href="/books">All books ↗</Link></div>
    <BookGrid items={related}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replaceAll('<','\\u003c')}}/>
  </section>;
}
