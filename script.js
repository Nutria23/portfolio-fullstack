/* ========================================
   FULL STACK DEVELOPER PORTFOLIO
   Optimized Three.js 3D + Interactions
   ======================================== */

// ==========================================
// THREE.JS 3D BACKGROUND (OPTIMIZED)
// ==========================================
(function initThreeBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); // antialias off for perf
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // cap DPR

    // Reduced particle count for smooth performance
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 150 : 300;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
        new THREE.Color(0x6c63ff),
        new THREE.Color(0x00d4ff),
        new THREE.Color(0xff6b9d),
        new THREE.Color(0x00e676),
        new THREE.Color(0xffd740),
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: isMobile ? 0.12 : 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Fewer floating shapes for perf
    const shapeCount = isMobile ? 3 : 6;
    const shapes = [];
    const geometries = [
        new THREE.TorusGeometry(1.5, 0.3, 6, 12),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.DodecahedronGeometry(1, 0),
        new THREE.TetrahedronGeometry(1.2, 0),
        new THREE.TorusKnotGeometry(0.8, 0.25, 32, 6),
    ];

    for (let i = 0; i < shapeCount; i++) {
        const geo = geometries[i % geometries.length];
        const mat = new THREE.MeshBasicMaterial({
            color: colorPalette[i % colorPalette.length],
            wireframe: true,
            transparent: true,
            opacity: 0.1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 20 - 10
        );
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        mesh.userData = {
            rx: (Math.random() - 0.5) * 0.004,
            ry: (Math.random() - 0.5) * 0.004,
            baseY: mesh.position.y,
            offset: Math.random() * Math.PI * 2,
        };
        shapes.push(mesh);
        scene.add(mesh);
    }

    camera.position.z = 20;

    // Throttled mouse
    let mouseX = 0, mouseY = 0;
    let tMouseX = 0, tMouseY = 0;
    document.addEventListener('mousemove', (e) => {
        tMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        tMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;

        mouseX += (tMouseX - mouseX) * 0.03;
        mouseY += (tMouseY - mouseY) * 0.03;

        // Simple rotation - no per-particle updates
        particles.rotation.y = time * 0.04 + mouseX * 0.08;
        particles.rotation.x = mouseY * 0.04;

        // Animate shapes
        for (let i = 0; i < shapes.length; i++) {
            const s = shapes[i];
            s.rotation.x += s.userData.rx;
            s.rotation.y += s.userData.ry;
            s.position.y = s.userData.baseY + Math.sin(time * 1.5 + s.userData.offset) * 0.6;
        }

        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.015;
        camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.015;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    // Debounced resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }, 150);
    }, { passive: true });
})();

// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const ls = document.getElementById('loading-screen');
        ls.classList.add('hidden');
        setTimeout(() => {
            document.querySelectorAll('.hero-section .animate-on-scroll').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), i * 120);
            });
        }, 200);
    }, 1800);
});

// ==========================================
// CURSOR GLOW (Desktop only)
// ==========================================
(function() {
    if (window.innerWidth < 768) return; // skip on mobile
    const glow = document.getElementById('cursor-glow');
    let cx = 0, cy = 0, gx = 0, gy = 0;

    document.addEventListener('mousemove', (e) => {
        cx = e.clientX;
        cy = e.clientY;
    }, { passive: true });

    function update() {
        gx += (cx - gx) * 0.06;
        gy += (cy - gy) * 0.06;
        glow.style.transform = `translate3d(${gx - 200}px, ${gy - 200}px, 0)`;
        requestAnimationFrame(update);
    }
    update();
})();

// ==========================================
// TYPING EFFECT
// ==========================================
(function() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const texts = ['Full Stack Developer', 'Web App Creator', 'Mobile App Developer', 'Automation Expert', 'UI/UX Enthusiast'];
    let ti = 0, ci = 0, deleting = false, speed = 80;

    function type() {
        const txt = texts[ti];
        el.textContent = deleting ? txt.substring(0, ci - 1) : txt.substring(0, ci + 1);
        ci += deleting ? -1 : 1;
        speed = deleting ? 35 : 75;

        if (!deleting && ci === txt.length) { speed = 2000; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % texts.length; speed = 300; }

        setTimeout(type, speed);
    }
    setTimeout(type, 2500);
})();

// ==========================================
// NAVIGATION
// ==========================================
(function() {
    const navbar = document.getElementById('navbar');
    const toggle = document.getElementById('nav-toggle');
    const mobile = document.getElementById('mobile-menu');
    const links = document.querySelectorAll('.nav-link');
    const mLinks = document.querySelectorAll('.mobile-link');
    const sections = document.querySelectorAll('.section');

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const sy = window.scrollY;
                navbar.classList.toggle('scrolled', sy > 50);

                let current = '';
                sections.forEach(s => {
                    if (sy >= s.offsetTop - 100) current = s.id;
                });
                links.forEach(l => {
                    l.classList.toggle('active', l.dataset.section === current);
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobile.classList.toggle('active');
        document.body.style.overflow = mobile.classList.contains('active') ? 'hidden' : '';
    });

    mLinks.forEach(l => l.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobile.classList.remove('active');
        document.body.style.overflow = '';
    }));
})();

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
(function() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                if (e.target.classList.contains('skill-category')) {
                    e.target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        if (!el.closest('.hero-section')) obs.observe(el);
    });
})();

// ==========================================
// COUNTER ANIMATION
// ==========================================
(function() {
    let done = false;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting && !done) {
                done = true;
                document.querySelectorAll('.stat-number').forEach(counter => {
                    const target = +counter.dataset.target;
                    const step = target / 100;
                    let current = 0;
                    const update = () => {
                        current += step;
                        if (current < target) {
                            counter.textContent = Math.ceil(current);
                            requestAnimationFrame(update);
                        } else counter.textContent = target;
                    };
                    update();
                });
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.hero-stats');
    if (stats) obs.observe(stats);
})();

// ==========================================
// PROJECT FILTER
// ==========================================
(function() {
    const btns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            cards.forEach((card, i) => {
                const match = filter === 'all' || card.dataset.type === filter;
                if (match) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.35s, transform 0.35s';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.classList.add('hidden'), 250);
                }
            });
        });
    });
})();

// ==========================================
// DEMO MODAL SYSTEM
// ==========================================
(function() {
    // Demo data for each project
    const projectDemos = {
        'Dashboard Analytics Pro': {
            demo: 'demos/dashboard.html',
            code: 'demos/dashboard-code.html',
        },
        'FitTrack App': {
            demo: 'demos/fittrack.html',
            code: 'demos/fittrack-code.html',
        },
        'AutoFlow System': {
            demo: 'demos/autoflow.html',
            code: 'demos/autoflow-code.html',
        },
        'LuxShop E-Commerce': {
            demo: 'demos/luxshop.html',
            code: 'demos/luxshop-code.html',
        },
        'TeamSync SaaS': {
            demo: 'demos/teamsync.html',
            code: 'demos/teamsync-code.html',
        },
        'DataPipeline Automation': {
            demo: 'demos/datapipeline.html',
            code: 'demos/datapipeline-code.html',
        },
    };

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'demo-modal';
    modal.innerHTML = `
        <div class="demo-modal-overlay"></div>
        <div class="demo-modal-content">
            <div class="demo-modal-header">
                <h3 id="demo-modal-title">Demo</h3>
                <button id="demo-modal-close" aria-label="Cerrar">&times;</button>
            </div>
            <iframe id="demo-modal-iframe" src="" frameborder="0"></iframe>
        </div>
    `;
    document.body.appendChild(modal);

    const overlay = modal.querySelector('.demo-modal-overlay');
    const closeBtn = document.getElementById('demo-modal-close');
    const iframe = document.getElementById('demo-modal-iframe');
    const title = document.getElementById('demo-modal-title');

    function openModal(src, name) {
        iframe.src = src;
        title.textContent = name;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { iframe.src = ''; }, 300);
    }

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // Wire up project buttons
    document.querySelectorAll('.project-card').forEach(card => {
        const projectTitle = card.querySelector('.project-title')?.textContent.trim();
        const demoData = projectDemos[projectTitle];
        if (!demoData) return;

        const btns = card.querySelectorAll('.project-link-btn');
        btns.forEach(btn => {
            const text = btn.textContent.trim().toLowerCase();
            if (text.includes('demo')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(demoData.demo, projectTitle + ' - Demo');
                });
            } else if (text.includes('digo') || text.includes('code')) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(demoData.code, projectTitle + ' - Código');
                });
            }
        });
    });
})();

// ==========================================
// CONTACT FORM
// ==========================================
(function() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.btn-submit');
        const orig = btn.innerHTML;
        btn.innerHTML = '<span class="btn-icon">✅</span> ¡Mensaje Enviado!';
        btn.style.background = 'linear-gradient(135deg, #00e676, #00d4ff)';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.disabled = false;
            form.reset();
        }, 3000);
    });
})();

// ==========================================
// BACK TO TOP
// ==========================================
(function() {
    const btn = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const t = document.querySelector(this.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ==========================================
// LIGHTWEIGHT 3D TILT (Desktop only, throttled)
// ==========================================
(function() {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.project-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const rx = (e.clientY - r.top - r.height / 2) / 25;
            const ry = (r.left + r.width / 2 - e.clientX) / 25;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.4s ease';
            setTimeout(() => { card.style.transition = ''; }, 400);
        });
    });
})();

console.log('%c🚀 Portfolio loaded!', 'color: #6c63ff; font-size: 14px; font-weight: bold;');
