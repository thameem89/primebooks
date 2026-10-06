import type { Metadata } from 'next';
import './globals.css';
import { Header, Footer } from '@/components/shell';
export const metadata: Metadata = {title:{default:'PRIME — Books that deserve to be discovered',template:'%s | PRIME'},description:'Discover books, meet publishers and explore professional book distribution with PRIME.',robots:{index:false,follow:false},openGraph:{title:'PRIME Book Distribution',description:'Books. Knowledge. Worldwide.'}};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en"><body><a className="skip" href="#main">Skip to content</a><Header/><main id="main">{children}</main><Footer/></body></html>}
