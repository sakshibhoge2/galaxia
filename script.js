/* GALAXIA cinematic edition. Native browser animation; no CDN dependencies. */
(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches;

  const motionButton = document.getElementById('motionToggle');

  function updateMotion() {
    document.documentElement.classList.toggle('motion-paused', paused);
    document.documentElement.dataset.motion = paused ? 'off' : 'on';

    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.disabled = reduced.matches;

    motionButton.setAttribute(
      'aria-label',
      paused
        ? 'Resume background animation'
        : 'Pause background animation'
    );

    motionButton.innerHTML = `
      <span aria-hidden="true">${paused ? '▶' : 'Ⅱ'}</span>
      <b>MOTION ${paused ? 'OFF' : 'ON'}</b>
    `;

    window.dispatchEvent(new Event('galaxia-motion'));
  }

  motionButton.addEventListener('click', () => {
    paused = !paused;
    updateMotion();
  });

  reduced.addEventListener('change', () => {
    paused = reduced.matches;
    updateMotion();
  });

  updateMotion();


  /* =====================================================
     NAVIGATION
     ===================================================== */

  const nav = document.getElementById('navbar');
  const menu = document.getElementById('mobileMenu');
  const menuButton = document.getElementById('hamburger');

  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
  }

  menuButton.addEventListener('click', () => {
    const open = menu.hidden;

    menu.hidden = !open;

    menuButton.setAttribute(
      'aria-expanded',
      String(open)
    );

    menuButton.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener(
    'resize',
    () => {
      if (innerWidth > 800) {
        closeMenu();
      }
    },
    { passive: true }
  );

  function updateNav() {
    nav.classList.toggle('scrolled', scrollY > 30);
  }

  addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* =====================================================
     ACTIVE NAVIGATION + REVEAL ANIMATIONS
     ===================================================== */

  if ('IntersectionObserver' in window) {

    const navObserver = new IntersectionObserver(
      entries => {
        entries.forEach(e => {

          if (e.isIntersecting) {

            document
              .querySelectorAll('.nav-link')
              .forEach(a => {

                const active =
                  a.hash === '#' + e.target.id;

                a.classList.toggle(
                  'active',
                  active
                );

                if (active) {
                  a.setAttribute(
                    'aria-current',
                    'location'
                  );
                } else {
                  a.removeAttribute(
                    'aria-current'
                  );
                }

              });
          }

        });
      },
      {
        rootMargin: '-20% 0px -60% 0px'
      }
    );

    document
      .querySelectorAll('main section[id]')
      .forEach(s => navObserver.observe(s));


    if (!reduced.matches) {

      const observer = new IntersectionObserver(
        entries => {

          entries.forEach(e => {

            if (e.isIntersecting) {

              e.target.classList.add(
                'in-view'
              );

              observer.unobserve(
                e.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );

      document
        .querySelectorAll(
          '.section-header,' +
          '.timeline-heading,' +
          '.timeline-item,' +
          '.contact-header,' +
          '.transmission-panel'
        )
        .forEach(el => {

          el.classList.add(
            'reveal-ready'
          );

          observer.observe(el);

        });
    }
  }


  /* =====================================================
     EVENT CAROUSEL
     ===================================================== */

  const selector =
    document.querySelector('.mission-selector');

  const grid =
    selector.querySelector('.events-grid');

  const cards =
    [...grid.querySelectorAll('.event-card')];

  const controls =
    selector.querySelector('.carousel-controls');

  const dots =
    selector.querySelector('.carousel-dots');

    /* Keep carousel controls attached to the card stage */
     grid.appendChild(controls);

    /* Keep carousel dots outside the arrow container
   so they can sit BELOW the cards */
     grid.appendChild(dots);
  const names =
    cards.map(c =>
      c
        .querySelector('h3')
        .innerText
        .replace(/\s+/g, ' ')
        .trim()
    );

  let current = 0;

  selector.classList.add(
    'carousel-ready'
  );

  selector.setAttribute(
    'aria-keyshortcuts',
    'ArrowLeft ArrowRight'
  );

  controls.hidden = false;


  cards.forEach((c, i) => {

    c.setAttribute(
      'role',
      'group'
    );

    c.setAttribute(
      'aria-roledescription',
      'slide'
    );

    c.setAttribute(
      'aria-label',
      `${i + 1} of ${cards.length}: ${names[i]}`
    );


    const dot =
      document.createElement('button');

    dot.className =
      'carousel-dot';

    dot.setAttribute(
      'aria-label',
      `Show ${names[i]}`
    );

    dot.addEventListener(
      'click',
      () => show(i)
    );

    dots.appendChild(dot);


    c.addEventListener(
      'click',
      e => {

        if (i !== current) {

          e.preventDefault();

          show(i);
        }

      }
    );

  });


  function show(index) {

    current =
      (index + cards.length) %
      cards.length;


    cards.forEach((c, i) => {

      const d =
        (i - current + cards.length) %
        cards.length;

      const active =
        d === 0;


      c.classList.toggle(
        'is-active',
        active
      );

      c.classList.toggle(
        'is-next',
        d === 1
      );

      c.classList.toggle(
        'is-prev',
        d === cards.length - 1
      );


      c.setAttribute(
        'aria-hidden',
        String(!active)
      );


      c.querySelectorAll(
        'a,button'
      ).forEach(a => {

        a.tabIndex =
          active ? 0 : -1;

      });


      dots.children[i].setAttribute(
        'aria-current',
        String(active)
      );

    });


    selector
      .querySelector('.carousel-caption')
      .textContent =
      `0${current + 1} / 0${cards.length} — ${names[current]}`;

  }


  document
    .getElementById('previousMission')
    .addEventListener(
      'click',
      () => show(current - 1)
    );


  document
    .getElementById('nextMission')
    .addEventListener(
      'click',
      () => show(current + 1)
    );


  selector.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {

        e.preventDefault();

        show(
          current +
          (
            e.key === 'ArrowRight'
              ? 1
              : -1
          )
        );

      }

    }
  );


  /* =====================================================
     TOUCH SWIPE
     ===================================================== */

  let touchX = null;
  let touchY = 0;

  grid.addEventListener(
    'touchstart',
    e => {

      touchX =
        e.changedTouches[0].clientX;

      touchY =
        e.changedTouches[0].clientY;

    },
    {
      passive: true
    }
  );


  grid.addEventListener(
    'touchend',
    e => {

      if (touchX === null) {
        return;
      }

      const dx =
        e.changedTouches[0].clientX -
        touchX;

      const dy =
        e.changedTouches[0].clientY -
        touchY;


      if (
        Math.abs(dx) > 55 &&
        Math.abs(dx) >
          Math.abs(dy) * 1.4
      ) {

        show(
          current +
          (dx < 0 ? 1 : -1)
        );

      }

      touchX = null;

    },
    {
      passive: true
    }
  );


  show(0);


  /* =====================================================
     CONTACT FORM
     GOOGLE APPS SCRIPT
     ===================================================== */

  const contactForm =
    document.getElementById(
      'contactForm'
    );

  const formStatus =
    document.getElementById(
      'formStatus'
    );

  const contactName =
    document.getElementById(
      'contactName'
    );

  const contactEmail =
    document.getElementById(
      'contactEmail'
    );

  const contactMessage =
    document.getElementById(
      'contactMessage'
    );

  const transmitButton =
    contactForm.querySelector(
      '.transmit-button'
    );


  const GOOGLE_SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbwTQmV_m0rT9wkGIUS7D4LjE2XETnLSS6DD7Jp1_AygObxUvoZkpZqzcI865VoBSIYR/exec';


  contactForm.addEventListener(
    'submit',
    async e => {

      e.preventDefault();


      /* ---------------------------------------------
         BASIC VALIDATION
         --------------------------------------------- */

      const name =
        contactName.value.trim();

      const email =
        contactEmail.value.trim();

      const message =
        contactMessage.value.trim();


      if (!name || !email || !message) {

        formStatus.textContent =
          '⚠ Please complete all transmission fields.';

        formStatus.classList.remove(
          'success'
        );

        formStatus.classList.add(
          'error'
        );

        return;

      }


      /* ---------------------------------------------
         EMAIL VALIDATION
         --------------------------------------------- */

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


      if (!emailPattern.test(email)) {

        formStatus.textContent =
          '⚠ Please enter a valid email address.';

        formStatus.classList.remove(
          'success'
        );

        formStatus.classList.add(
          'error'
        );

        contactEmail.focus();

        return;

      }


      /* ---------------------------------------------
         TRANSMITTING STATE
         --------------------------------------------- */

      transmitButton.disabled = true;

      transmitButton.innerHTML = `
        <span>TRANSMITTING...</span>
        <span class="transmit-arrow">↗</span>
      `;


      formStatus.textContent =
        'TRANSMITTING YOUR MESSAGE...';

      formStatus.classList.remove(
        'success',
        'error'
      );


      /* ---------------------------------------------
         DATA TO GOOGLE APPS SCRIPT
         --------------------------------------------- */

      const data = {
        name: name,
        email: email,
        message: message
      };


      try {

        await fetch(
          GOOGLE_SCRIPT_URL,
          {
            method: 'POST',

            mode: 'no-cors',

            headers: {
              'Content-Type':
                'text/plain;charset=utf-8'
            },

            body: JSON.stringify(data)
          }
        );


        /* -----------------------------------------
           SUCCESS STATE

           NOTE:
           no-cors does not allow the browser to
           read the Apps Script response.

           The request has been dispatched to the
           Apps Script endpoint.
           ----------------------------------------- */

        formStatus.textContent =
          '✓ TRANSMISSION SENT SUCCESSFULLY';

        formStatus.classList.remove(
          'error'
        );

        formStatus.classList.add(
          'success'
        );


        /* -----------------------------------------
           RESET FORM AFTER 3.5 SECONDS
           ----------------------------------------- */

        setTimeout(() => {

          contactForm.reset();

          formStatus.textContent = '';

          formStatus.classList.remove(
            'success',
            'error'
          );

        }, 3500);


      } catch (error) {

        console.error(
          'Transmission error:',
          error
        );


        formStatus.textContent =
          '✕ TRANSMISSION FAILED. PLEASE TRY AGAIN.';

        formStatus.classList.remove(
          'success'
        );

        formStatus.classList.add(
          'error'
        );


        setTimeout(() => {

          formStatus.textContent = '';

          formStatus.classList.remove(
            'error'
          );

        }, 4000);

      }


      /* ---------------------------------------------
         RESTORE BUTTON
         --------------------------------------------- */

      setTimeout(() => {

        transmitButton.disabled = false;

        transmitButton.innerHTML = `
          <span>SEND TRANSMISSION</span>
          <span class="transmit-arrow">→</span>
        `;

      }, 1500);

    }
  );


  /* =====================================================
     MULTI-DEPTH MONOCHROME STARFIELD
     ===================================================== */

  const starsCanvas =
    document.getElementById(
      'bgCanvas'
    );

  const ctx =
    starsCanvas.getContext('2d');

  let width =
    innerWidth;

  let height =
    innerHeight;

  let dpr = 1;

  let stars = [];

  let starFrame = 0;

  let starLast = 0;

  let clock = 0;


  function resizeStars() {

    width =
      innerWidth;

    height =
      innerHeight;

    dpr =
      Math.min(
        devicePixelRatio || 1,
        1.5
      );


    starsCanvas.width =
      Math.round(
        width * dpr
      );

    starsCanvas.height =
      Math.round(
        height * dpr
      );


    starsCanvas.style.width =
      width + 'px';

    starsCanvas.style.height =
      height + 'px';


    stars =
      Array.from(
        {
          length:
            width < 700
              ? 100
              : 230
        },
        () => ({
          x:
            Math.random() * width,

          y:
            Math.random() * height,

          z:
            Math.random(),

          p:
            Math.random() * 6.28
        })
      );


    paintStars(0);

  }


  function paintStars(dt) {

    clock += dt;

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    for (const s of stars) {

      if (!paused) {

        s.y +=
          dt *
          (
            0.45 +
            s.z * 2
          );

        s.x +=
          dt * 0.17;


        if (s.y > height) {
          s.y = 0;
        }

      }


      const a =
        0.2 +
        s.z * 0.4 +
        Math.sin(
          clock * 0.25 + s.p
        ) * 0.09;


      ctx.fillStyle =
        `rgba(211,224,239,${a})`;

      ctx.beginPath();

      ctx.arc(
        s.x,
        s.y,
        0.35 + s.z * 0.85,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }

  }


  function starLoop(t) {

    const dt =
      starLast
        ? Math.min(
            (t - starLast) / 1000,
            0.06
          )
        : 0;


    starLast = t;

    paintStars(dt);

    starFrame =
      requestAnimationFrame(
        starLoop
      );

  }


  function syncStars() {

    cancelAnimationFrame(
      starFrame
    );

    starLast = 0;

    paintStars(0);


    if (
      !paused &&
      !document.hidden
    ) {

      starFrame =
        requestAnimationFrame(
          starLoop
        );

    }

  }


  resizeStars();

  syncStars();

  addEventListener(
    'resize',
    resizeStars,
    { passive: true }
  );

  addEventListener(
    'galaxia-motion',
    syncStars
  );

  document.addEventListener(
    'visibilitychange',
    syncStars
  );


  /* =====================================================
     HERO PARALLAX
     ===================================================== */

  const hero =
    document.querySelector(
      '.hero'
    );

  const plate =
    document.querySelector(
      '.hero-plate'
    );


  let targetX = 0;
  let targetY = 0;

  let px = 0;
  let py = 0;

  let parallaxFrame = 0;


  hero.addEventListener(
    'pointermove',
    e => {

      if (
        e.pointerType === 'touch'
      ) {
        return;
      }


      const r =
        hero.getBoundingClientRect();


      targetX =
        (
          e.clientX /
          r.width -
          0.5
        ) * 10;


      targetY =
        (
          (
            e.clientY -
            r.top
          ) /
          r.height -
          0.5
        ) * 7;

    },
    {
      passive: true
    }
  );


  hero.addEventListener(
    'pointerleave',
    () => {

      targetX =
        targetY =
        0;

    }
  );


  function parallax() {

    px +=
      (targetX - px) *
      0.035;

    py +=
      (targetY - py) *
      0.035;


    plate.style.transform =
      `scale(1.04) translate3d(${px}px,${py}px,0)`;


    parallaxFrame =
      requestAnimationFrame(
        parallax
      );

  }


  function syncParallax() {

    cancelAnimationFrame(
      parallaxFrame
    );


    if (
      !paused &&
      !document.hidden
    ) {

      parallaxFrame =
        requestAnimationFrame(
          parallax
        );

    } else {

      plate.style.transform =
        'scale(1.04)';

    }

  }


  syncParallax();

  addEventListener(
    'galaxia-motion',
    syncParallax
  );

  document.addEventListener(
    'visibilitychange',
    syncParallax
  );


  /* =====================================================
     GPU-RENDERED MOVING FOG
     ===================================================== */

  const fog =
    document.getElementById(
      'atmosphere'
    );


  try {

    const gl =
      fog.getContext(
        'webgl',
        {
          alpha: true,
          premultipliedAlpha: false,
          antialias: false,
          powerPreference: 'low-power'
        }
      );


    if (gl) {

      const vertex =
        'attribute vec2 a; varying vec2 v; void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';


      const fragment = `
        precision mediump float;
        varying vec2 v;
        uniform float t;
        uniform float aspect;

        float hash(vec2 p){
          return fract(
            sin(
              dot(
                p,
                vec2(127.1,311.7)
              )
            ) * 43758.5453
          );
        }

        float noise(vec2 p){

          vec2 i = floor(p);
          vec2 f = fract(p);

          f = f*f*(3.-2.*f);

          return mix(
            mix(
              hash(i),
              hash(i+vec2(1.,0.)),
              f.x
            ),

            mix(
              hash(i+vec2(0.,1.)),
              hash(i+vec2(1.,1.)),
              f.x
            ),

            f.y
          );

        }

        float fbm(vec2 p){

          float f=0.;
          float a=.5;

          for(int i=0;i<4;i++){

            f += a * noise(p);

            p =
              p * 2.03 +
              2.3;

            a *= .5;

          }

          return f;

        }

        void main(){

          vec2 p =
            vec2(
              v.x * aspect,
              v.y
            ) * 3.;

          float n =
            fbm(
              p +
              vec2(
                t*.019,
                -t*.008
              ) +
              fbm(
                p*1.6 -
                vec2(t*.012,0.)
              )
            );

          float floorFade =
            1. -
            smoothstep(
              .15,
              .67,
              v.y
            );

          float edge =
            .35 +
            abs(v.x-.5);

          float a =
            smoothstep(
              .3,
              .8,
              n
            ) *
            floorFade *
            edge *
            .20;

          gl_FragColor =
            vec4(
              .65,
              .70,
              .77,
              a
            );

        }
      `;


      function compile(
        type,
        code
      ) {

        const s =
          gl.createShader(type);

        gl.shaderSource(
          s,
          code
        );

        gl.compileShader(s);


        if (
          !gl.getShaderParameter(
            s,
            gl.COMPILE_STATUS
          )
        ) {

          throw Error(
            gl.getShaderInfoLog(s)
          );

        }


        return s;

      }


      const program =
        gl.createProgram();


      gl.attachShader(
        program,
        compile(
          gl.VERTEX_SHADER,
          vertex
        )
      );


      gl.attachShader(
        program,
        compile(
          gl.FRAGMENT_SHADER,
          fragment
        )
      );


      gl.linkProgram(
        program
      );


      if (
        !gl.getProgramParameter(
          program,
          gl.LINK_STATUS
        )
      ) {

        throw Error(
          'Fog shader link failed'
        );

      }


      gl.useProgram(
        program
      );


      const buffer =
        gl.createBuffer();


      gl.bindBuffer(
        gl.ARRAY_BUFFER,
        buffer
      );


      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1,-1,
           1,-1,
          -1, 1,
          -1, 1,
           1,-1,
           1, 1
        ]),
        gl.STATIC_DRAW
      );


      const attr =
        gl.getAttribLocation(
          program,
          'a'
        );


      gl.enableVertexAttribArray(
        attr
      );


      gl.vertexAttribPointer(
        attr,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );


      const time =
        gl.getUniformLocation(
          program,
          't'
        );

      const aspect =
        gl.getUniformLocation(
          program,
          'aspect'
        );


      let fogFrame = 0;
      let last = 0;
      let age = 0;
      let inView = true;


      function fogResize() {

        const r =
          hero.getBoundingClientRect();


        fog.width =
          Math.min(
            1000,
            Math.round(r.width)
          );


        fog.height =
          Math.round(
            fog.width *
            r.height /
            r.width
          );


        gl.viewport(
          0,
          0,
          fog.width,
          fog.height
        );


        gl.uniform1f(
          aspect,
          fog.width /
          fog.height
        );

      }


      function fogLoop(
        stamp
      ) {

        if (
          !last ||
          stamp - last > 48
        ) {

          age +=
            last
              ? Math.min(
                  (stamp - last) /
                  1000,
                  0.1
                )
              : 0;


          last = stamp;


          gl.uniform1f(
            time,
            age
          );


          gl.drawArrays(
            gl.TRIANGLES,
            0,
            6
          );

        }


        fogFrame =
          requestAnimationFrame(
            fogLoop
          );

      }


      function syncFog() {

        cancelAnimationFrame(
          fogFrame
        );

        last = 0;


        if (
          !paused &&
          !document.hidden &&
          inView
        ) {

          fogFrame =
            requestAnimationFrame(
              fogLoop
            );

        }

      }


      fogResize();

      syncFog();


      addEventListener(
        'resize',
        fogResize,
        { passive: true }
      );


      addEventListener(
        'galaxia-motion',
        syncFog
      );


      document.addEventListener(
        'visibilitychange',
        syncFog
      );


      if (
        'IntersectionObserver'
        in window
      ) {

        new IntersectionObserver(
          ([e]) => {

            inView =
              e.isIntersecting;

            syncFog();

          }
        ).observe(hero);

      }


      fog.addEventListener(
        'webglcontextlost',
        e => {

          e.preventDefault();

          cancelAnimationFrame(
            fogFrame
          );

          fog.hidden = true;

        }
      );

    }

  } catch (error) {

    fog.hidden = true;

    console.warn(
      'Atmospheric animation unavailable; static scene retained.'
    );

  }

})();