'use client';
import Link from 'next/link';
import {useRef} from 'react';
export default function MobileNav(){const menu=useRef<HTMLDetailsElement>(null);return <details className="mobile-nav" ref={menu}><summary aria-label="Open navigation">☰</summary><nav aria-label="Mobile navigation" onClick={e=>{if((e.target as HTMLElement).closest('a')&&menu.current)menu.current.open=false;}}>{[['Home','/'],['Books','/books'],['Publishers','/publishers'],['Distribution','/distribution'],['About','/about'],['Contact','/contact'],['Publisher registration','/register/publisher'],['Bookstore registration','/register/bookstore']].map(([name,url])=><Link key={url} href={url}>{name}</Link>)}</nav></details>}
