import {pageMetadata} from '@/lib/metadata';
import Catalogue from '@/components/catalogue';
export const metadata=pageMetadata('Book catalogue',"/books");
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string>>}){return <section className="wrap section"><p className="eyebrow">DISCOVER YOUR NEXT CHAPTER</p><h1 className="page-title">The catalogue.</h1><p className="intro">Stories, ideas and perspectives worth exploring.</p><p className="demo-note">Fictional demo books and publishers. Availability is illustrative.</p><Catalogue initial={await searchParams}/></section>}
