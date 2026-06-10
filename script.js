// MENU MOBILE

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// allow keyboard toggle on hamburger (Enter / Space)
if(hamburger){
    hamburger.addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            navLinks.classList.toggle('active');
        }
    });
}


// MODE SOMBRE

const themeBtn = document.getElementById("theme-toggle");
if(themeBtn){
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        localStorage.setItem(
            "theme",
            document.body.classList.contains("dark") ? "dark" : "light"
        );
    });
}

// apply theme on load (respect saved preference or system)
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
} else if(!localStorage.getItem("theme") && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.body.classList.add("dark");
}

// Header shrink on scroll
const header = document.querySelector('header');
const onScroll = () => {
    if(!header) return;
    if(window.scrollY > 12){
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
};
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Top particles techy background (lightweight canvas)
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('top-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = 0, h = 0, particles = [], animId = null, paused = false;

    const config = {
        maxRadius: 3.2,
        linkDistance: 110,
        speed: 0.25,
        colors: ['rgba(37,99,235,0.9)','rgba(99,102,241,0.85)','rgba(16,185,129,0.9)']
    };

    function resize(){
        const ratio = window.devicePixelRatio || 1;
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.floor(w * ratio));
        canvas.height = Math.max(1, Math.floor(h * ratio));
        ctx.setTransform(ratio,0,0,ratio,0,0);
    }

    function initParticles(){
        particles = [];
        // scale particle count with viewport area for balance between density and performance
        const area = Math.max(1, w * h);
        let desired = Math.round(area / 25000); // empirical scaling
        desired = Math.min(Math.max(desired, 20), 140); // clamp between 20 and 140

        for(let i=0;i<desired;i++){
            particles.push({
                x: Math.random()*w,
                y: Math.random()*h,
                vx: (Math.random()-0.5)*config.speed,
                vy: (Math.random()-0.5)*config.speed,
                r: Math.random()*config.maxRadius + 0.8,
                c: config.colors[i % config.colors.length]
            });
        }
    }

    function step(){
        if(paused) return;
        ctx.clearRect(0,0,w,h);

        // draw links
        for(let i=0;i<particles.length;i++){
            const p = particles[i];
            for(let j=i+1;j<particles.length;j++){
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx*dx+dy*dy);
                if(dist < config.linkDistance){
                    ctx.strokeStyle = 'rgba(100,116,255,'+ (0.18*(1 - dist/config.linkDistance)) +')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        // draw particles
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < -10 || p.x > w+10) p.vx *= -1;
            if(p.y < -10 || p.y > h+10) p.vy *= -1;

            ctx.beginPath();
            ctx.fillStyle = p.c;
            ctx.globalAlpha = 0.85;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
            ctx.fill();
        });

        animId = requestAnimationFrame(step);
    }

    function start(){
        cancelAnimationFrame(animId);
        resize();
        initParticles();
        paused = false;
        step();
    }

    function stop(){
        paused = true;
        cancelAnimationFrame(animId);
    }

    // Visibility handling to save CPU
    document.addEventListener('visibilitychange', () => {
        if(document.hidden) stop(); else start();
    });

    window.addEventListener('resize', () => {
        // small debounce
        clearTimeout(window._topCanvasResize);
        window._topCanvasResize = setTimeout(() => {
            resize();
        }, 120);
    });

    start();
});


// SCROLL-DRIVEN ANIMATIONS (IntersectionObserver)

document.addEventListener('DOMContentLoaded', () => {

    // Staggered hero animations
    const hero = document.querySelector('.hero');
    if(hero){
        const heroElems = hero.querySelectorAll('img, h1, h2, p, .btn');
        heroElems.forEach((el, i) => {
            el.classList.add('reveal');
            // small stagger
            setTimeout(() => el.classList.add('active'), i * 120);
        });
    }

    // IntersectionObserver for other reveals
    const ioOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.15
    };

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add('active');
                // small icon pulse if applicable
                const icon = entry.target.querySelector('i');
                if(icon) icon.classList.add('icon-animate');
                observer.unobserve(entry.target);
            }
        });
    }, ioOptions);

    document.querySelectorAll('.reveal, .animate-on-scroll').forEach(el => io.observe(el));

});

