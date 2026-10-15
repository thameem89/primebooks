'use client';
import Link from 'next/link';
import {useEffect,useState,useSyncExternalStore} from 'react';
import {quotes} from '@/lib/quotes';
import {QuoteRotation} from '@/lib/quote-rotation';
import './quote-banner.css';

export default function QuoteBanner(){
  const [rotation]=useState(()=>new QuoteRotation(quotes.length));
  const state=useSyncExternalStore(rotation.subscribe,rotation.getSnapshot,rotation.getServerSnapshot);
  useEffect(()=>{
    const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibility=()=>rotation.pause('hidden',document.hidden);
    const preference=()=>rotation.pause('reduced',motion.matches);
    visibility();preference();rotation.start();
    document.addEventListener('visibilitychange',visibility);
    motion.addEventListener('change',preference);
    // Decode all small local portraits ahead of navigation; image/text share one fade layer.
    for(const quote of quotes){const portrait=new Image();portrait.src=quote.image;void portrait.decode().catch(()=>{});}
    return ()=>{rotation.dispose();document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',preference);};
  },[rotation]);
  const quote=state.index===null?null:quotes[state.index];
  return <section className="quote-section wrap" aria-label="Words to grow by">
    <div className="quote-banner" role="region" aria-roledescription="carousel" aria-label="Featured literary quotation"
      onMouseEnter={()=>rotation.pause('hover',true)} onMouseLeave={()=>rotation.pause('hover',false)}
      onFocusCapture={()=>rotation.pause('focus',true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))rotation.pause('focus',false);}}>
      {quote?<div className={'quote-frame'+(state.reduced?' quote-still':'')} key={state.version} data-quote-id={quote.id}>
        <div className="quote-portrait"><img src={quote.image} alt={'Portrait of '+quote.name} style={{objectPosition:quote.imagePosition}} width="800" height="1000"/></div>
        <div className="quote-copy"><p className="quote-eyebrow">WORDS TO GROW BY</p><span className="quote-mark" aria-hidden="true">“</span>
          <blockquote><p>{quote.text}</p></blockquote>
          <p className="quote-attribution">{quote.name}<span>{quote.role}</span></p>
          <Link className="quote-link" href="/books">Explore Books <span aria-hidden="true">→</span></Link>
        </div>
      </div>:<div className="quote-placeholder" role="status">A little inspiration for your next chapter…</div>}
      <p className="sr-only" aria-live="polite" aria-atomic="true">{state.manual&&quote?quote.name+": "+quote.text:""}</p>
      <div className="quote-navigation">
        <div className="quote-arrows"><button type="button" aria-label="Previous quote" onClick={()=>rotation.previous()} disabled={state.index===null}>←</button><button type="button" aria-label="Next quote" onClick={()=>rotation.next()} disabled={state.index===null}>→</button></div>
        <div className="quote-dots" aria-label="Choose a quote">{quotes.map((item,index)=><button key={item.id} type="button" aria-label={'Show quote '+(index+1)+' by '+item.name} aria-current={state.index===index?'true':undefined} onClick={()=>rotation.select(index)}><span/></button>)}</div>
        <span className="quote-count" aria-hidden="true">{state.index===null?'—':String(state.index+1).padStart(2,'0')} / {String(quotes.length).padStart(2,'0')}</span>
        <button className="quote-pause" type="button" aria-label={state.userPaused?'Resume automatic quotes':'Pause automatic quotes'} aria-pressed={state.userPaused} disabled={state.reduced} onClick={()=>rotation.pause('user',!state.userPaused)}>{state.reduced?'Manual':state.userPaused?'Play':'Pause'}</button>
      </div>
    </div>
    <div className="quote-credit"><span>Literary inspiration · no endorsement implied</span>{quote&&<details onFocusCapture={()=>rotation.pause('focus',true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))rotation.pause('focus',false);}}><summary>Source & portrait credits</summary><p><a href={quote.source} target="_blank" rel="noreferrer">{quote.work}</a><br/>{quote.photographer}. <a href={quote.imageSource} target="_blank" rel="noreferrer">{quote.licence} portrait · Wikimedia Commons</a>.</p></details>}</div>
  </section>;
}
