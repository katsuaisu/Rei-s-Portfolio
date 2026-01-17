"use strict";

const pubmatsData = ['assets/alitaptap.png', 'assets/ua.png', 'assets/forgood.png', 'assets/dpblast.png', 'assets/sr.png', 'assets/ml.png', 'assets/cringe.png', 'assets/pb.png', 'assets/pb1.png'];
const postersData = ['assets/1.png', 'assets/6.png', 'assets/3.png', 'assets/7.png', 'assets/eng.png', 'assets/analysis.png', 'assets/event.png', 'assets/info.png', 'assets/old.png', 'assets/pp.png', 'assets/pp1.png'];
const photographyData = ['assets/p1.JPG', 'assets/p2.JPG', 'assets/p3.JPG', 'assets/p4.jpg', 'assets/p5.JPG'];
const websitesData = [
    { title: "ChiikArcade", url: "https://katsuaisu.github.io/WDProjStrontiumDulaySaquing/", desc: "One of my most creative works challenging my balance of code and creativity." },
    { title: "Photobooth Ni Rei", url: "https://katsuaisu.github.io/Photobooth-Ni-Rei/", desc: "A functional photobooth app." },
    { title: "Christmas Gift", url: "https://katsuaisu.github.io/SHC-Christmas-Gift/", desc: "A Wicked-themed website made for my friends as a Christmas gift." },
    { title: "Haraya Booth Tracker", url: "https://katsuaisu.github.io/Haraya-Booth-Tracker/", desc: "A tracker I made for my section for our assassination booth." },
    { title: "LifeOS", url: "https://katsuaisu.github.io/LifeOS/", desc: "A personal work where I track finances, studies, schedule, and notes." },
    { title: "GwaKawa", url: "https://katsuaisu.github.io/GwaKawa/", desc: "A WIP website where you can track your GWA and individual subject grades." }
];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let w, h;
let scrollY = 0;

const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
};
window.addEventListener('resize', resize);
resize();

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    const parallaxElements = document.querySelectorAll('[data-speed]');
    parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed'));
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

const starImg = new Image();
starImg.src = 'assets/star.png';
const colors = [
    { name: 'pink', filter: 'hue-rotate(320deg)' },
    { name: 'yellow', filter: 'hue-rotate(50deg)' },
    { name: 'blue', filter: 'hue-rotate(200deg)' }
];
let assetsLoaded = false;
const starCaches = {};

starImg.onload = () => {
    colors.forEach(col => {
        const c = document.createElement('canvas');
        const cx = c.getContext('2d');
        c.width = 30; c.height = 30;
        cx.filter = col.filter;
        cx.drawImage(starImg, 0, 0, 30, 30);
        starCaches[col.name] = c;
    });
    assetsLoaded = true;
};

class Star {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 12 + 10;
        this.baseY = this.y;
        this.parallaxFactor = Math.random() * 0.5;
        this.speedY = Math.random() * 0.2 + 0.05;
        this.colorKey = colors[Math.floor(Math.random() * colors.length)].name;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    update() {
        this.y -= this.speedY;

        let displayY = this.y - (scrollY * this.parallaxFactor);

        if (displayY < -30) {
            this.y = h + 30 + (scrollY * this.parallaxFactor);
            this.x = Math.random() * w;
        }
        return displayY;
    }
    draw() {
        if (!assetsLoaded) return;
        let displayY = this.update();
        ctx.globalAlpha = this.opacity;
        const img = starCaches[this.colorKey];
        if (img) ctx.drawImage(img, this.x, displayY, this.size, this.size);
        ctx.globalAlpha = 1.0;
    }
}

const stars = Array.from({ length: 80 }, () => new Star());
function animate() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => s.draw());
    requestAnimationFrame(animate);
}
animate();

const bgMusic = document.getElementById('bg-music');
const sfxSquish = document.getElementById('sfx-squish');
const muteBtn = document.getElementById('mute-btn');
let isMuted = false;
let hasInteracted = false;

window.addEventListener('click', () => {
    if (!hasInteracted && !isMuted) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Audio requires interaction"));
        hasInteracted = true;
    }
}, { once: true });

window.toggleMute = function () {
    isMuted = !isMuted;
    if (isMuted) {
        bgMusic.pause();
        muteBtn.innerText = "🔇";
    } else {
        bgMusic.play();
        muteBtn.innerText = "🔊";
    }
}
window.playSquish = function () {
    if (!isMuted) {
        sfxSquish.currentTime = 0;
        sfxSquish.play();
    }
}

const title = document.getElementById('animated-title');
if (title) {
    const originalText = title.innerText;
    title.innerHTML = '';
    [...originalText].forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'gummy-letter';
        span.innerText = char === " " ? "\u00A0" : char;
        span.setAttribute('data-char', char);
        span.style.setProperty('--d', `${i * 0.1}s`);
        title.appendChild(span);
    });
}

const dialogueOverlay = document.getElementById('dialogue-overlay');
const dialogueText = document.getElementById('dialogue-text');
const reilienChar = document.getElementById('reilien-char');
let pendingModalId = null;
let typingInterval = null;

const dialogues = {
    'pubmats': "Welcome to the Gallery! I'm currently experimenting on what theme I specialize in, but here are some of my works that I'm proud of!",
    'posters': "Oh! You found the Project Posters. These are spanning from SY 2023-CURRENT. (≧◡≦)",
    'websites': "Entering the digital zone... I express my creativity usually through code. Care to look?",
    'photography': "Snap! 📸 I've recently taken photography as a hobby. Here are some photos I think are pretty cool :)"
};

function typeWriter(text, element, speed = 30) {
    element.innerHTML = "";
    let i = 0;
    clearInterval(typingInterval);

    typingInterval = setInterval(() => {
        if (i < text.length) {
            let char = text.charAt(i);
            if (char === " ") char = " ";
            element.append(char);
            i++;
        } else {
            clearInterval(typingInterval);
        }
    }, speed);
}

window.triggerDialogue = function (type) {
    pendingModalId = 'modal-' + type;
    dialogueOverlay.style.display = 'block';
    if (reilienChar) {
        reilienChar.style.transform = 'translateY(100%)';
        setTimeout(() => {
            reilienChar.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            reilienChar.style.transform = 'translateY(0)';
        }, 10);
    }
    typeWriter(dialogues[type], dialogueText);
}

window.handleDialogueClick = function () {
    dialogueOverlay.style.display = 'none';
    clearInterval(typingInterval);
    if (pendingModalId) {
        window.openModal(pendingModalId);
        pendingModalId = null;
    }
}

window.openModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.style.display = 'flex';
}
window.closeModal = function () {
    document.querySelectorAll('.modal-overlay').forEach(m => m.style.display = 'none');
}
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) window.closeModal();
});

function renderGallery(containerId, imageList) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';
    imageList.forEach((imgName, index) => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        let src = imgName.includes('placeholder') ? `https://placehold.co/300x300/2a0b45/fff?text=Upload+${imgName}` : imgName;
        item.innerHTML = `<img src="${src}" alt="Gallery Image ${index}" onclick="openLightbox(this.src)">`;
        grid.appendChild(item);
    });
}

function renderWebsites() {
    const list = document.getElementById('list-websites');
    if (!list) return;
    list.innerHTML = '';
    websitesData.forEach(site => {
        const item = document.createElement('div');
        item.className = 'website-item';
        item.innerHTML = `
            <div class="web-info">
                <h3>${site.title}</h3>
                <p>${site.desc}</p>
            </div>
            <a href="${site.url}" target="_blank" class="shiny-pixel-btn small">VISIT</a>
        `;
        list.appendChild(item);
    });
}

renderGallery('grid-pubmats', pubmatsData);
renderGallery('grid-posters', postersData);
renderGallery('grid-photography', photographyData);
renderWebsites();

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
lightboxImg.addEventListener('click', function (e) {
    e.stopPropagation();
    this.classList.toggle('zoomed');
});
window.openLightbox = function (src) {
    playSquish();
    lightboxImg.src = src;
    lightboxImg.classList.remove('zoomed');
    lightbox.style.display = 'flex';
}
window.closeLightbox = function () {
    lightbox.style.display = 'none';
    lightboxImg.classList.remove('zoomed');
}
lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) closeLightbox();
});