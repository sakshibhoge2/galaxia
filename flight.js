/* One cinematic ship. No additional scenery or external animation library.
   Asset: a transparent rendered sprite; flight uses curved paths and perspective.
   Adjust maxWidth, minWidth or seconds below to tune its presence. */
(() => {
  'use strict';
  const canvas = document.getElementById('falconFlight');
  const ctx = canvas && canvas.getContext('2d');
  if (!ctx) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const ship = new Image();
  ship.src = 'assets/falcon-flight.webp';
  const settings = { maxWidth: 205, minWidth: 110, seconds: [19, 27] };
  let w = 0, h = 0, dpr = 1, frame = 0, previous = 0, elapsed = 0, route;
  const random = (a, b) => a + Math.random() * (b - a);
  const mix = (a, b, t) => a + (b - a) * t;
  const bezier = (a,b,c,d,t) => (1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t*t*c + t**3*d;
  const derivative = (a,b,c,d,t) => 3*(1-t)**2*(b-a) + 6*(1-t)*t*(c-b) + 3*t*t*(d-c);
  function resize() {
    w = innerWidth; h = innerHeight; dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    canvas.style.width = w+'px'; canvas.style.height = h+'px';
  }
  function newRoute(initial = false) {
    const right = Math.random() > .5;
    const start = random(.22,.82), end = random(.22,.82);
    route = {
      x: right ? [-.2,.15,.85,1.2] : [1.2,.85,.15,-.2],
      y: [start, Math.max(.15, Math.min(.88,start+random(-.25,.25))), Math.max(.15,Math.min(.88,end+random(-.25,.25))), end],
      right, duration: random(...settings.seconds), depth: random(.68,.85), phase: random(0,Math.PI*2)
    };
    elapsed = initial ? route.duration*.12 : 0;
  }
  function draw(now) {
    const dt = previous ? Math.min((now-previous)/1000,.05) : 0;
    previous = now; elapsed += dt;
    if (elapsed > route.duration) newRoute();
    const t = Math.min(1,elapsed/route.duration), x=route.x, y=route.y;
    ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
    // Never fly across the homepage/cockpit hero. The decorative ship starts once Events is reached.
    const events = document.getElementById('events');
    const flightAllowed = events && window.scrollY > Math.max(0, events.offsetTop - innerHeight * .62);
    if (!flightAllowed) { frame = requestAnimationFrame(draw); return; }
    const px = bezier(...x,t)*w, py = bezier(...y,t)*h;
    const vx = derivative(...x,t)*w, vy = derivative(...y,t)*h;
    let angle = Math.atan2(vy,vx);
    if (!route.right) angle -= Math.PI;
    // The turn follows the path tangent. Perspective changes smoothly in flight.
    const depth = route.depth + .2*Math.sin(Math.PI*t);
    const mobile = w < 700;
    const width = mix(settings.minWidth,settings.maxWidth,depth) * (mobile ? .57 : 1);
    const height = width * ship.height / ship.width;
    const bank = 1 - .09*Math.sin(Math.PI*t+route.phase);
    ctx.save(); ctx.translate(px,py); ctx.rotate(angle);
    ctx.scale(route.right ? 1 : -1,bank);
    ctx.globalAlpha = mobile ? .48 : .65;
    ctx.drawImage(ship,-width/2,-height/2,width,height);
    ctx.restore();
    frame = requestAnimationFrame(draw);
  }
  function sync() {
    cancelAnimationFrame(frame); previous=0;
    if (reduce.matches || document.hidden || document.documentElement.dataset.motion === 'off' || !ship.complete || !ship.naturalWidth) {
      ctx.clearRect(0,0,canvas.width,canvas.height); return;
    }
    frame=requestAnimationFrame(draw);
  }
  resize(); newRoute(true);
  ship.addEventListener('load',sync);
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  reduce.addEventListener('change',sync);
  window.addEventListener('galaxia-motion',sync);
  if (ship.complete) sync();
})();
