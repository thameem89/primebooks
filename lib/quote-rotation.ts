export const QUOTE_INTERVAL = 7000;
export type PauseReason = 'hover'|'focus'|'hidden'|'reduced'|'user';
type Snapshot = {index:number|null;version:number;userPaused:boolean;reduced:boolean;manual:boolean};
const serverSnapshot:Snapshot={index:null,version:0,userPaused:false,reduced:false,manual:false};
/** Owns the shuffle bag and timer; React only renders on a quote or user-preference change. */
export class QuoteRotation {
  private bag:number[]=[];
  private history:number[]=[];
  private cursor=-1;
  private reasons=new Set<PauseReason>();
  private timer:ReturnType<typeof setTimeout>|undefined;
  private listeners=new Set<()=>void>();
  private running=false;
  private snapshot:Snapshot=serverSnapshot;
  private count:number;
  private random:()=>number;
  constructor(count:number,random:()=>number=Math.random){this.count=count;this.random=random;if(count<2)throw new Error('At least two quotes are required.');}
  subscribe=(listener:()=>void)=>{this.listeners.add(listener);return ()=>{this.listeners.delete(listener);};};
  getSnapshot=()=>this.snapshot;
  getServerSnapshot=()=>serverSnapshot;
  private emit(index=this.snapshot.index,manual=false){this.snapshot={index,version:this.snapshot.version+(index!==this.snapshot.index?1:0),userPaused:this.reasons.has('user'),reduced:this.reasons.has('reduced'),manual};this.listeners.forEach(fn=>fn());}
  private schedule(){clearTimeout(this.timer);if(this.running&&this.reasons.size===0)this.timer=setTimeout(()=>this.next(false),QUOTE_INTERVAL);}
  private draw(){
    if(!this.bag.length){
      this.bag=Array.from({length:this.count},(_,i)=>i);
      for(let i=this.bag.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.bag[i],this.bag[j]]=[this.bag[j],this.bag[i]];}
      // The bag is popped: keep the first draw of a new cycle different from the last quote.
      if(this.bag.at(-1)===this.snapshot.index)[this.bag[0],this.bag[this.count-1]]=[this.bag[this.count-1],this.bag[0]];
    }
    return this.bag.pop()!;
  }
  start(){this.running=true;if(this.snapshot.index===null)this.next(false);else this.schedule();}
  dispose(){this.running=false;clearTimeout(this.timer);}
  next(manual=true){
    const index=this.cursor<this.history.length-1?this.history[++this.cursor]:this.draw();
    if(this.cursor===this.history.length-1&&this.history[this.cursor]!==index){this.history.push(index);this.cursor++;}
    if(this.cursor===-1){this.history.push(index);this.cursor=0;}
    this.emit(index,manual);this.schedule();
  }
  previous(){if(this.cursor===0){this.next(true);return;}if(this.cursor>0){this.cursor--;this.emit(this.history[this.cursor],true);}this.schedule();}
  select(index:number){
    if(index<0||index>=this.count)return;
    if(index!==this.snapshot.index){this.bag=this.bag.filter(value=>value!==index);this.history=this.history.slice(0,this.cursor+1);this.history.push(index);this.cursor++;this.emit(index,true);}
    this.schedule();
  }
  pause(reason:PauseReason,paused:boolean){
    if(this.reasons.has(reason)===paused)return;
    if(paused)this.reasons.add(reason);else this.reasons.delete(reason);
    if(reason==='user'||reason==='reduced')this.emit(this.snapshot.index);
    this.schedule();
  }
}
