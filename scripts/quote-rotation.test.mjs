import test from 'node:test';import assert from 'node:assert/strict';
import {QuoteRotation,QUOTE_INTERVAL} from '../lib/quote-rotation.ts';
function random(seed=1){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
test('random initial selection, complete shuffle cycles and no consecutive repeats',()=>{
 const starts=new Set();for(let seed=0;seed<30;seed++){const r=new QuoteRotation(6,random(seed*50000));r.start();starts.add(r.getSnapshot().index);const seen=[];for(let i=0;i<120;i++){seen.push(r.getSnapshot().index);r.next();}for(let i=0;i<seen.length;i+=6)assert.equal(new Set(seen.slice(i,i+6)).size,6);for(let i=1;i<seen.length;i++)assert.notEqual(seen[i],seen[i-1]);r.dispose();}assert.ok(starts.size>1);
});
test('7-second automatic rotation and all pause reasons resume safely',t=>{
 t.mock.timers.enable({apis:['setTimeout']});const r=new QuoteRotation(6,random());r.start();let current=r.getSnapshot().index;t.mock.timers.tick(QUOTE_INTERVAL-1);assert.equal(r.getSnapshot().index,current);t.mock.timers.tick(1);assert.notEqual(r.getSnapshot().index,current);
 for(const reason of ['hover','focus','hidden','reduced','user']){r.pause(reason,true);current=r.getSnapshot().index;t.mock.timers.tick(21000);assert.equal(r.getSnapshot().index,current);r.pause(reason,false);t.mock.timers.tick(6999);assert.equal(r.getSnapshot().index,current);t.mock.timers.tick(1);assert.notEqual(r.getSnapshot().index,current);}r.dispose();
});
test('manual next, previous and pagination restart countdown; overlapping pauses stay paused',t=>{
 t.mock.timers.enable({apis:['setTimeout']});const r=new QuoteRotation(6,random());r.start();const first=r.getSnapshot().index;t.mock.timers.tick(6000);r.next();const second=r.getSnapshot().index;assert.notEqual(first,second);t.mock.timers.tick(1000);assert.equal(r.getSnapshot().index,second);r.previous();assert.equal(r.getSnapshot().index,first);r.next();assert.equal(r.getSnapshot().index,second);r.select(5);assert.equal(r.getSnapshot().index,5);t.mock.timers.tick(6999);assert.equal(r.getSnapshot().index,5);r.pause('hover',true);r.pause('focus',true);r.pause('hover',false);t.mock.timers.tick(21000);assert.equal(r.getSnapshot().index,5);r.pause('focus',false);t.mock.timers.tick(7000);assert.notEqual(r.getSnapshot().index,5);r.dispose();
});
test('server snapshot is stable and initial reduced motion disables autoplay',t=>{t.mock.timers.enable({apis:['setTimeout']});const r=new QuoteRotation(6,random());assert.equal(r.getServerSnapshot().index,null);r.pause('reduced',true);r.start();const first=r.getSnapshot().index;t.mock.timers.tick(70000);assert.equal(r.getSnapshot().index,first);assert.equal(r.getSnapshot().reduced,true);r.next();assert.notEqual(r.getSnapshot().index,first);r.dispose();});
