(() => {
  'use strict';
  const canvas = document.getElementById('heroWarp');
  const hero = document.getElementById('home');
  if (!canvas || !hero) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let w=0,h=0,dpr=1,cx=0,cy=0,frame=0,last=0,stars=[];
  let speed=1;
  function seed(){
    const count = w < 700 ? 240 : 520;
    stars = Array.from({length:count},()=>({
      a:Math.random()*Math.PI*2,
      r:Math.pow(Math.random(),1.85)*Math.max(w,h)*.72+8,
      z:.18+Math.random()*.82,
      l:20+Math.random()*95,
      p:Math.random()*6.28
    }));
  }
  function resize(){
    const r=hero.getBoundingClientRect(); w=Math.max(1,r.width); h=Math.max(1,r.height);
    dpr=Math.min(devicePixelRatio||1,1.5); canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    canvas.style.width=w+'px';canvas.style.height=h+'px';cx=w*.5;cy=h*.44;seed();draw(0);
  }
  function draw(dt){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(w,h)*.72);
    grad.addColorStop(0,'#09131d');grad.addColorStop(.52,'#04080d');grad.addColorStop(1,'#010204');ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    speed += ((document.documentElement.dataset.motion==='off'?0:1)-speed)*.04;
    for(const s of stars){
      if(!reduce.matches && document.documentElement.dataset.motion!=='off'){
        s.r += dt*(22+95*s.z)*speed;
        if(s.r>Math.max(w,h)*.82){s.r=5+Math.random()*20;s.a=Math.random()*Math.PI*2;s.z=.18+Math.random()*.82;}
      }
      const x=cx+Math.cos(s.a)*s.r, y=cy+Math.sin(s.a)*s.r*.72;
      const tail=2.5+s.z*18*speed;
      const px=cx+Math.cos(s.a)*Math.max(0,s.r-tail), py=cy+Math.sin(s.a)*Math.max(0,s.r-tail)*.72;
      const alpha=.24+s.z*.64;
      ctx.strokeStyle=`rgba(${195+Math.round(40*s.z)},${218+Math.round(25*s.z)},255,${alpha})`;
      ctx.lineWidth=.45+s.z*1.6;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(x,y);ctx.stroke();
      if(s.z>.75){ctx.fillStyle=`rgba(238,248,255,${alpha*.75})`;ctx.fillRect(x,y,1.2+s.z,1.2+s.z)}
    }
  }
  function loop(t){const dt=last?Math.min((t-last)/1000,.05):0;last=t;draw(dt);frame=requestAnimationFrame(loop)}
  function sync(){cancelAnimationFrame(frame);last=0;if(!document.hidden)frame=requestAnimationFrame(loop)}
  resize();sync();addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',sync);window.addEventListener('galaxia-motion',sync);
})();
